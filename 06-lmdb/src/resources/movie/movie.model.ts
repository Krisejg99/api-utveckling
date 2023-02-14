import { Schema, Document, model } from 'mongoose'

export interface IMovie extends Document {
	title: string,
	runtime?: number,
	releaseYear?: number,
}

const MovieSchema: Schema = new Schema<IMovie>({
	title: { type: String, required: true },
	runtime: { type: Number },
	releaseYear: { type: Number },
})

export const Movie = model<IMovie>('Movie', MovieSchema)
