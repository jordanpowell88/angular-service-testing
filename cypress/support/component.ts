// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { mount } from 'cypress/angular'
import { ProviderToken } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { HttpClientModule } from '@angular/common/http'
import { firstValueFrom, Observable } from 'rxjs'



function inject<T>(service: ProviderToken<T>): Cypress.Chainable<T> {
  TestBed.configureTestingModule({
    providers: [service],
    imports: [HttpClientModule]
  });
  
  // @ts-ignore
  const serviceName = service.name
  
  Cypress.log({
    name: 'inject',
    message: `Injected ${serviceName}`,
    consoleProps: () => ({ service: serviceName })
  })
  
  return cy.wrap<T>(TestBed.inject(service), { log: false })
}

type Service = { [key: string]: (...args: any[]) => any  }

function invokeService<T extends Service>(method: keyof T, ...args: any[]): Cypress.Chainable<ReturnType<T[keyof T]>>
function invokeService<T extends Service>(service: T, method: keyof T, ...args: any[]): Cypress.Chainable<ReturnType<T[keyof T]>> {
  const response: ReturnType<T[keyof T]> = service[method](args)
  const value: Promise<ReturnType<T[keyof T]>> = firstValueFrom(response)

  const _args = args.length > 0 ? 'with ${args}' : ''

  Cypress.log({
    name: 'invokeService',
    message: `Invoked method ${method as string} on Service ${_args}`,
    consoleProps: () => ({ method, args })
  })

  return cy.wrap(value, { log: false })
}

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
      inject: typeof inject
      invokeService: typeof invokeService
    }
  }
}

Cypress.Commands.add('mount', mount)
Cypress.Commands.add('inject', inject)
// @ts-ignore
Cypress.Commands.add('invokeService', { prevSubject: true }, invokeService)

// Example use:
// cy.mount(MyComponent)