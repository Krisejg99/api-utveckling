import { Schema, Document, model } from 'mongoose'
import { IMovie } from '../movie/movie.model'

export interface IPerson extends Document {
	name: string,
}

const PersonSchema: Schema = new Schema<IPerson>({
	name: {
		type: String,
		required: true,
		trim: true,
		minlength: 3,
	},
})

export const Person = model<IPerson>('Person', PersonSchema)
