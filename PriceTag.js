const data = require("./data.js");

module.exports = class PriceTag{
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
        this._string = "(unpriced)";
    }

    static noteSplitter(note){
        // ~b/o 6 chaos
        let parts = /[^/\d](\d+) (.+)$/g.exec(note);
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
        console.log("b");

        return null;
    }

    static currencyFromAbbr(abbr){
        for(let currency of data.currMap){
            for(let item of currency[1]){
                if(item === abbr){
                    return currency;
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
        let currency = PriceTag.currencyFromAbbr(split.type);
        if(currency){
            this.priced = true;
            this.amount = split.amount;
            this.amountStr = split.amountStr;
            this.currency = currency[0];
            this.currencyshort = currency[0]
                .toLowerCase()
                .replace("orb of ", "")
                .replace(" orb", "");
            this.type = type;
            this._string = null;
        }else{
            this.setUnpriced();
        }
    }

    get string(){
        if(this._string) return this._string;
        if(!this.priced) return "(unpriced)";
        return this._string = `${this.amountStr} ${this.currencyshort}`;
    }

    //a weak tag doesnt have much info on it
    weakTag(amount, currency){
        this.isweak = true;
        this.amount = amount;
        this.currencyshort = currency;
        this._string = amount + " " + currency;
    }

    //return true if this is cheaper than other
    compareBO(other){
        if(other.currencyshort !== this.currencyshort) return false;
        if(other.amount < this.amount) return false;
        return true;
    }
}
