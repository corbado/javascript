/* tslint:disable */
/* eslint-disable */
/**
 * Corbado Frontend API
 * Overview of all Corbado Frontend API calls to implement passwordless authentication.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: support@corbado.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


// May contain unused imports in some cases
// @ts-ignore
import { RequestData } from './request-data';

/**
 * 
 * @export
 * @interface GenericRsp
 */
export interface GenericRsp {
    /**
     * HTTP status code of operation
     * @type {number}
     * @memberof GenericRsp
     */
    'httpStatusCode': number;
    /**
     * 
     * @type {string}
     * @memberof GenericRsp
     */
    'message': string;
    /**
     * 
     * @type {RequestData}
     * @memberof GenericRsp
     */
    'requestData': RequestData;
    /**
     * Runtime in seconds for this request
     * @type {number}
     * @memberof GenericRsp
     */
    'runtime': number;
}

