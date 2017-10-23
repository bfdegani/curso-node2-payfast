curl -X POST http://localhost:3000/upload/imagem --data-binary @imagem.jpg -H "Content-type: application/octet-stream" -v -H "filename: imagem.jpg"
