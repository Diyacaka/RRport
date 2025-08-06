class vehicle {
    constructor(brand, year) {
        this.brand = brand,
        this.year = year
    }

    wheeler() {
        console.log(`this is my new motor ${this.brand}`); 
    }
}

const car = new vehicle(`Toyota`, `1999`)

car.wheeler()