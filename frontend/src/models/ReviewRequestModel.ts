class ReviewRequestModel {
  constructor(
    public bookId: number,
    public rating: number,
    public reviewDescription: string
  ) {}
}
export default ReviewRequestModel;