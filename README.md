POST /questions/ask to create a new question
curl -X POST http://localhost:3000/questions/ask \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sample Question Title",
    "detail": "Sample question details",
    "author": "Author Name"
  }'

PUT /question/:id to Update an existing question
curl -X PUT http://localhost:3000/question/687be940d987c3d780afa393 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Question Title",
    "detail": "Updated question details",
    "author": "Updated Author"
  }'


DELETE /question/:id to Delete a question by ID

curl -X DELETE http://localhost:3000/question/687be940d987c3d780afa393


