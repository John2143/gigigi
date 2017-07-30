import {currencyAbbrList} from "./data.js";
import {cache} from "./decorators.js";

export default class PriceTag{
    constructor(note, stashnote, isweak){
        if(isweak){
            this.weakTag(note, stashnote);
            return;
        }
        this.note = note;
        this.stashnote = stashnote;

        //try note first
        this.createPriceTag(this.note);
        //then try tab name
        if(!this.priced) this.createPriceTag(this.stashnote);
    }

    setUnpriced(){
        this.priced = false;
        this.string = "(unpriced)";
    }

    static noteSplitter(note){
        // ~b/o 6 chaos
        let parts = /[^/\d.](\d+) (.+)$/g.exec(note);
        if(parts) return {
            amount: Number(parts[1]),
            amountStr: parts[1],
            type: parts[2]
        };

        // ~b/o 1/4 exa
        parts = /(\d+)\/(\d+) (.+)$/g.exec(note);
        if(parts) return {
            amount: Number(parts[1]) / Number(parts[2]),
            amountStr: `${parts[1]}/${parts[2]}`,
            type: parts[3]
        };

        // ~b/o 4.5 exa
        parts = /(\d+.\d+) (.+)$/g.exec(note);
        if(parts) return {
            amount: Number(parts[1]),
            amountStr: parts[1],
            type: parts[2]
        };

        return null;
    }

    static currencyIDFromAbbr(abbr){
        for(let i = 0; i < currencyAbbrList.length; i++){
            let currency = currencyAbbrList[i];
            for(let item of currency[2]){
                if(item === abbr){
                    return i;
                }
            }
        }
    }

    //parse the note for data
    createPriceTag(note){
        if(this.weak) throw "tried to price a weak tag";
        if(!note) return this.setUnpriced();

        let type;

        if(
            note.startsWith("~b/o") || note.startsWith("~gb/o") ||
            note.startsWith("b/o")  || note.startsWith("gb/o")
        ){
            type = "b/o price";
        }else if(
            note.startsWith("~price") ||
            note.startsWith("price")
        ){
            type = "exact price";
        }else{
            return this.setUnpriced();
        }

        //split the note into type, amount, and currency
        let split = PriceTag.noteSplitter(note);
        if(!split) return;
        split.type = split.type.toLowerCase();

        //loop through every currency type and match abbriveations
        let currencyid = PriceTag.currencyIDFromAbbr(split.type);
        if(currencyid){
            this.priced = true;
            this.amount = split.amount;
            this.amountStr = split.amountStr;
            this.currencyid = currencyid;
            this.currency = currencyAbbrList[currencyid][1];
            this.currencyshort = this.currency
                .toLowerCase()
                .replace("orb of ", "")
                .replace(" orb", "");
            this.type = type;
            this.string = null;
        }else{
            this.setUnpriced();
        }
    }

    @cache get string(){
        if(!this.priced) return "(unpriced)";
        return `${this.amountStr} ${this.currencyshort}`;
    }

    //a weak tag doesnt have much info on it
    weakTag(amount, currency){
        this.isweak = true;
        this.amount = amount;
        this.currencyshort = currency;
        this.string = amount + " " + currency;
    }

    //return true if this is cheaper than other
    compareBO(other){
        if(other.currencyshort !== this.currencyshort) return false;
        if(other.amount < this.amount) return false;
        return true;
    }
}
