curl -X "POST" \
 'http://mixtral-8x22b-instruct-v01.nim-service:8000/v1/chat/completions' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
        "model": "mistralai/mixtral-8x22b-instruct-v0.1",
        "messages": [
        {
          "content":"What should I do for a 4 day vacation at Cape Hatteras National Seashore?",
          "role": "user"
        }],
        "top_p": 1,
        "n": 1,
        "max_tokens": 1024,
        "stream": false,
        "frequency_penalty": 0.0,
        "stop": ["STOP"]
      }'
