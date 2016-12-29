import 'rxjs/add/operator/map';

import { BaseRequestOptions, ConnectionBackend, Headers, Http, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { TestBed, inject } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { Angular2TokenService } from 'angular2-token';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

class Mock { }

describe('Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        BaseRequestOptions,
        MockBackend,
        { provide: ActivatedRoute, useClass: Mock },
        Angular2TokenService,
        {
          provide: Http,
          useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => new Http(backend, defaultOptions),
          deps: [MockBackend, BaseRequestOptions]
        },
      ]
    });
  });

  it('should get aliases', inject([Angular2TokenService, MockBackend], (tokenService: Angular2TokenService, backend: MockBackend) => {
    backend.connections.subscribe(c => {
      expect(c.request.url).toEqual('/test');
      expect(c.request.method).toBe(RequestMethod.Get);
      c.mockRespond(new Response(new ResponseOptions({
        headers: new Headers({}),
        body: { user: 'foo'}
      })));
    });

    tokenService.init();
    tokenService.get('/test')
      .map((response: Response) =>  response.json())
      .subscribe(response => {
        expect(response.user).toEqual('foo');
      });
  }));
});
