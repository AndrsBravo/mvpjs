import { defineEnPointParams, defineEndPointRequest, fetchEndPoint, prepareEndPointData } from "./endPointFactoryRunTimeMethod";

/**
 * 
 * @param {EndPoint} endPoint 
 */
function defineModelHttpMethod(endPoint) {

    const httpMethod = {

        /**
         * 
         * @returns {Response}
         */
        get: async () => {
            defineEndPointRequest.apply(endPoint)
            const result = await fetchEndPoint.apply(endPoint);
            this.endPointCollectionDataChangeListener(result);
            return endPoint.response;
        },

        /**
         * 
         * @params {object} params 
         * @returns {Response}
         */
        getparam: async (params) => {

            defineEnPointParams.apply(endPoint, [params]);
            defineEndPointRequest.apply(endPoint)
            const result = await fetchEndPoint.apply(endPoint);
            this.endPointCollectionDataChangeListener(result);
            return endPoint.response;
        },

        /**
         * @param {object} data Data to POST on Rest Api
         * @returns {Response}
         */
        post: async (data) => {

            prepareEndPointData.apply(endPoint, [data])
            defineEndPointRequest.apply(endPoint);
            const result = await fetchEndPoint.apply(endPoint);
            this.endPointCollectionDataChangeListener(result);
            return endPoint.response;
        },

        /**
         * 
         * @param {object} data Data to PUT on Rest Api
         * @returns {Response}
         */
        put: async (data) => {
            defineEnPointParams.apply(endPoint, [data]);
            prepareEndPointData.apply(endPoint, [data]);
            defineEndPointRequest.apply(endPoint);
            const result = await fetchEndPoint.apply(endPoint);
            this.endPointCollectionDataChangeListener(result);
            return endPoint.response;
        },

        /**
         * @param {object} param 
         * @returns {Response}
         */
        delete: async (param) => {
            defineEnPointParams.apply(endPoint, [param]);
            defineEndPointRequest.apply(endPoint);
            const result = await this.fetchEndPoint.apply(endPoint);
            this.endPointCollectionDataChangeListener(result);
            return endPoint.response;
        }

    }

    let { method } = endPoint.requestInit;

    if (method == "GET" && endPoint.params.length > 0) method = method + "param";
    Object.defineProperty(this, endPoint.requestInit.method, { value: httpMethod[method.toLowerCase()], writable: false });

}

export { defineModelHttpMethod };