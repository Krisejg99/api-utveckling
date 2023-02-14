/**
 * Movie Router
 */
import express from 'express'
import { body } from 'express-validator'
import * as movieController from './movie.controller'
import { createMovieRules, updateMovieRules } from './movie.validations'

const router = express.Router()

/**
 * GET /movies
 */
router.get('/', movieController.index)

/**
 * GET /movies/:movieId
 */
router.get('/:movieId', movieController.show)

/**
 * POST /movies
 */
router.post('/', createMovieRules, movieController.store)

/**
 * PATCH /movies
 */
router.patch('/:movieId', updateMovieRules, movieController.update)

/**
 * DELETE /movies
 */
router.delete('/:movieId', movieController.destroy)

export default router
