'use strict';

import { IdentityProvider } from './IdentityProvider';
import { SessionProvider } from './SessionProvider';

angular
    .module('pipSession', [])
    .provider('pipIdentity', IdentityProvider)
    .provider('pipSession', SessionProvider); 
