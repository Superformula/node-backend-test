const cdk = require('@aws-cdk/core');
const dynamodb = require('@aws-cdk/aws-dynamodb');
const apigateway = require('@aws-cdk/aws-apigateway');

class UsersStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);

        const usersStack = this;
        const { stackName } = props;

        // create users table
        const usersTable = new dynamodb.Table(usersStack, 'Users', {
            partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY, // allow table delete
        });

        // create sk-scz (state, city, zip) global secondary index
        usersTable.addGlobalSecondaryIndex({
            indexName: 'sk-scz-index',
            partitionKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'scz', type: dynamodb.AttributeType.STRING },
        });

        // create api gateway
        const api = new apigateway.RestApi(usersStack, `${stackName}-Users-API`, {
            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                allowMethods: apigateway.Cors.ALL_METHODS,
            },
        });

        // add resources to api
        const usersResource = api.root.addResource('users');
        const oneUserResource = usersResource.addResource('{id}');
    }
}

module.exports = { UsersStack };
