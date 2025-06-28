import BookModel from "./BookModel";

class ShelfCurrentLoans {
  constructor(public book: BookModel, public daysLeft: number, public isReviewLeft:boolean) {}
}

export default ShelfCurrentLoans;