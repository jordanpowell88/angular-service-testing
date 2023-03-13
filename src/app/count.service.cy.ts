import { HttpClientModule } from "@angular/common/http"
import { TestBed } from "@angular/core/testing"
import { createOutputSpy } from "cypress/angular"
import { firstValueFrom, Observable } from "rxjs"
import { AppComponent } from "./app.component"
import { CountService } from "./count.service"

describe('CounterService', () => {
    it('should return a count from API using legacy approach', () => {
        cy.intercept('GET', '/count', { count: 5 }).then(async () => {
           TestBed.configureTestingModule({
            providers: [CountService],
            imports: [HttpClientModule]
           })

           const countService = TestBed.inject(CountService);
           const response = await firstValueFrom(countService.getCount())
           expect(response).equal(5)
        })
    })
      
    it('should return a count from API', () => {
        cy.intercept('GET', '/count', { count: 5 }).then(() => {
            cy.inject(CountService).invokeService('getCount').should('equal', 5)
        })
    })

    it('should return a double count from API', () => {
        cy.intercept('GET', '/doubleCount', { statusCode: 200 }).then(() => {
            cy.inject(CountService).invokeService('getDoubleCount', 5).should('equal', 10)
        })
    })
})