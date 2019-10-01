<a name="Consent"></a>

## Consent
Module for managing application consent

**Kind**: global class  

* [Consent](#Consent)
    * [new Consent(sdk, request, baseUrl, [organizationId])](#new_Consent_new)
    * [.accept(consentId)](#Consent+accept) ⇒ <code>Promise</code>
    * [.getForCurrentApplication()](#Consent+getForCurrentApplication) ⇒ <code>Promise</code>

<a name="new_Consent_new"></a>

### new Consent(sdk, request, baseUrl, [organizationId])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| sdk | <code>Object</code> |  | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> |  | An instance of the request module tied to this module's audience. |
| baseUrl | <code>string</code> |  | The base URL provided by the parent module |
| [organizationId] | <code>string</code> | <code>null</code> | The organization ID to be used in tenant url requests |

<a name="Consent+accept"></a>

### contxtSdk.coordinator.consent.accept(consentId) ⇒ <code>Promise</code>
Accepts a user's consent to an application


API Endpoint: '/consents/:consentId/accept'
Method: POST

**Kind**: instance method of [<code>Consent</code>](#Consent)  
**Fulfill**: [<code>ContxtUserConsentApproval</code>](./Typedefs.md#ContxtUserConsentApproval)  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| consentId | <code>string</code> | The ID of the consent form the user is accepting Note: Only valid for web users using auth0WebAuth session type |

**Example**  
```js
contxtSdk.coordinator.consent
  .accept('36b8421a-cc4a-4204-b839-1397374fb16b')
  .then((userApproval) => console.log(userApproval))
  .catch((err) => console.log(err));
```
<a name="Consent+getForCurrentApplication"></a>

### contxtSdk.coordinator.consent.getForCurrentApplication() ⇒ <code>Promise</code>
Gets the current application version's consent forms. The current
access_token will be used to derive which application is being consented to.


API Endpoint: '/applications/consent'
Method: POST

Note: Only valid for web users using auth0WebAuth session type

**Kind**: instance method of [<code>Consent</code>](#Consent)  
**Fulfill**: [<code>ContxtApplicationConsent</code>](./Typedefs.md#ContxtApplicationConsent)  
**Reject**: <code>Error</code>  
**Example**  
```js
contxtSdk.coordinator.consent
  .getForCurrentApplication()
  .then((applicationConsent) => console.log(applicationConsent))
  .catch((err) => console.log(err));
```
