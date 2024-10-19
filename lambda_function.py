

# 10/19/2024 6:03 PM
import json
import boto3
from botocore.exceptions import ClientError

# Initialize Bedrock client
bedrock_client = boto3.client('bedrock-runtime', region_name='us-west-2')

def lambda_handler(event, context):
    try:
        # Extract the topic from the event body
        body = json.loads(event['body'])
        topic = body.get('userTopic')
        print(f"Generating flashcards for topic: {topic}")
        
        # Set model ID for Claude (use the appropriate Claude model)
        model_id = 'anthropic.claude-3-5-sonnet-20240620-v1:0'
        
        # Prepare the conversation payload (using "Converse" API format)
        conversation = [
            {
                "role": "user",
                "content": [{"text": f"Please generate 10 flashcards about the topic: Ensure it follows a Question, Answer format for each flashcard {topic}"}]
            }
        ]

        # Set inference configuration for the model
        inference_config = {
            "maxTokens": 512,  # Maximum token count for the response
            "temperature": 0.5,
            "topP": 0.9
        }

        # Send the request to Bedrock using the Converse API
        response = bedrock_client.converse(
            modelId=model_id,
            messages=conversation,
            inferenceConfig=inference_config
        )

        # Extract the response from the model
        response_text = response['output']['message']['content'][0]['text']
        print(f"Model response: {response_text}")
        
        # Return the generated flashcards in the Lambda response
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,PUT,GET'
            },
            'body': json.dumps({
                'flashcards': response_text
            })
        }

    except ClientError as err:
        # Handle client error
        print(f"Client error: {err}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,PUT,GET'
            },
            'body': json.dumps({'error': f"A client error occurred: {err}"})
        }

    except Exception as e:
        # Handle general exception
        print(f"Unexpected error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,PUT,GET'
            },
            'body': json.dumps({'error': f"An unexpected error occurred: {str(e)}"})
        }
