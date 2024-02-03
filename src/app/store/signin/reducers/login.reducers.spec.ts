import { AppState, VerifiedUser } from "../../../types"
import { initialState } from "../../signup/reducers/signup.reducers"
import { signInSuccess } from "../actions/login.actions"
import { loginFeature } from "./login.reducers"

fdescribe('LoginFeature', () => {
    describe('unknown action', () => {
        it('should return the default state', () => {
            const action = {
                type: 'unknown'
            }

            const state = loginFeature.reducer(initialState, action)
            expect(state).toBe(initialState)
        })
    })

    describe('signInSuccess action', () => {
        it('should update the state', () => {
            const payload: VerifiedUser = {
                email: 'test@gmail.com',
                firstName: 'Test',
                lastName: 'Tester',
                role: 'USER',
                token: '39049909320'
            }
            const newState: AppState = {
                token: '39049909320',
                user: {
                    email: payload.email,
                    firstName: payload.firstName,
                    lastName: payload.lastName
                }
            }
            const action = signInSuccess(payload)

            const state = loginFeature.reducer(initialState, action)

            expect(state).toEqual(newState)
        })
    })
})