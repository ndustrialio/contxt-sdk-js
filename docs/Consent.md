<a name="Consent"></a>

## Consent
Module for managing application consent

**Kind**: global class  

* [Consent](#Consent)
    * [new Consent(sdk, request, baseUrl)](#new_Consent_new)
    * [.accept(audienceName, consentId)](#Consent+accept) ⇒ <code>Promise</code>
    * [.verify(audienceName)](#Consent+verify) ⇒ <code>Promise</code>

<a name="new_Consent_new"></a>

### new Consent(sdk, request, baseUrl)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>Object</code> | An instance of the SDK so the module can communicate with other modules |
| request | <code>Object</code> | An instance of the request module tied to this module's audience. |
| baseUrl | <code>string</code> | The base URL provided by the parent module |

<a name="Consent+accept"></a>

### contxtSdk.coordinator.consent.accept(audienceName, consentId) ⇒ <code>Promise</code>
Accepts a user's consent to an application for a given audience name


API Endpoint: '/consents/:consentId/accept'
Method: POST

**Kind**: instance method of [<code>Consent</code>](#Consent)  
**Fulfill**: [<code>ContxtUserConsentApproval</code>](./Typedefs.md#ContxtUserConsentApproval)  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| audienceName | <code>string</code> | The auth0 audience that the user is consenting with |
| consentId | <code>string</code> | The ID of the consent form the user is accepting |

**Example**  
```js
contxtSdk.coordinator.consent
  .accept('coordinator', '36b8421a-cc4a-4204-b839-1397374fb16b')
  .then((userApproval) => console.log(userApproval))
  .catch((err) => console.log(err));
```
<a name="Consent+verify"></a>

### contxtSdk.coordinator.consent.verify(audienceName) ⇒ <code>Promise</code>
Verify if application consent is needed from the user for a given audience name


API Endpoint: '/applications/consent'
Method: POST

**Kind**: instance method of [<code>Consent</code>](#Consent)  
**Fulfill**: [<code>ContxtApplicationConsent</code>](./Typedefs.md#ContxtApplicationConsent)  
**Reject**: <code>Error</code>  

| Param | Type | Description |
| --- | --- | --- |
| audienceName | <code>string</code> | The auth0 audience that the user is verifying consent with |

**Example**  
```js
contxtSdk.coordinator.consent
  .verify('coordinator')
  .then((applicationConsent) => console.log(applicationConsent))
  .catch((err) => console.log(err));
```
