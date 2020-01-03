const cdk = require('@aws-cdk/core');
const dynamodb = require('@aws-cdk/aws-dynamodb');
const apigateway = require('@aws-cdk/aws-apigateway');
const lambda = require('@aws-cdk/aws-lambda');

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

        // create lambda layer
        const crudLayer = new lambda.LayerVersion(usersStack, `${stackName}-CRUD-Layer`, {
            layerVersionName: `${stackName}-CRUD-Layer`,
            code: new lambda.AssetCode('src/layers/crud'),
        });

        // create lambdas for various CRUD actions
        const crudActions = [
            {
                name: 'Create',
                method: 'POST',
                asset: 'src/lambdas/createUser/',
                handler: 'createUser.handler',
                resource: usersResource,
            },
            {
                name: 'Read',
                method: 'GET',
                asset: 'src/lambdas/readUser/',
                handler: 'readUser.handler',
                resource: oneUserResource,
            },
            {
                name: 'Update',
                method: 'PATCH',
                asset: 'src/lambdas/updateUser/',
                handler: 'updateUser.handler',
                resource: oneUserResource,
            },
            {
                name: 'Delete',
                method: 'DELETE',
                asset: 'src/lambdas/deleteUser/',
                handler: 'deleteUser.handler',
                resource: oneUserResource,
            },
        ];

        // map over CRUD actions
        crudActions.map(entry => {
            const {
                name: crudName,
                method: crudMethod,
                asset: crudAsset,
                handler: crudHandler,
                resource: crudResource,
                validator: crudValidator,
            } = entry;

            const crudLambda = new lambda.Function(usersStack, `${crudName}User`, {
                functionName: `${stackName}-${crudName}User`,
                code: new lambda.AssetCode(crudAsset),
                handler: crudHandler,
                runtime: lambda.Runtime.NODEJS_12_X,
                memorySize: 1024,
                deadLetterQueueEnabled: true,
                layers: [crudLayer],
                environment: {
                    TABLE_NAME: usersTable.tableName,
                    AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
                },
            });

            // grant lambda access to dynamo table
            usersTable.grantReadWriteData(crudLambda);

            // add api integration for lambda
            const integration = new apigateway.LambdaIntegration(crudLambda, {
                passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_MATCH,
            });

            // Attach api method to lambda
            crudResource.addMethod(crudMethod, integration);
        });
    }
}

module.exports = { UsersStack };
