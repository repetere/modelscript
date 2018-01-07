<a name="appConfig"></a>

## appConfig(customProcess) ⇒ <code>Promise</code>
Takes command line arguments or user specified process arguments for app configuration and creates a
standardized application configuration object. Falls back to using .env file if available or the defa
ult configuration settings.

**Kind**: global function
**Returns**: <code>Promise</code> - resolves to application configuration

| Param | Type | Description |
| --- | --- | --- |
| customProcess | <code>Object</code> \| <code>undefined</code> | user specified process with arguments or undefined for using command line arguments |