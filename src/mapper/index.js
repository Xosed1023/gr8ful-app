// Import the necessary modules
const fs = require('fs');

// Function to read the file and transform its content
function transformPhrases(inputFile, outputFile) {
  fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    // Split the file content into individual phrases
    const phrases = data.split('\n\n').filter(Boolean);
    const transformedPhrases = phrases.map((phrase, index) => {
      const lines = phrase.split('\n');
      const author = lines.find(line => line.startsWith('author:')).split(': ')[1];
      const type = lines.find(line => line.startsWith('type:')).split(': ')[1];
      const es = lines.find(line => line.startsWith('es:')).split(': ')[1].replace(/"/g, '');
      const en = lines.find(line => line.startsWith('en:')).split(': ')[1].replace(/"/g, '');
      const fr = lines.find(line => line.startsWith('fr:')).split(': ')[1].replace(/"/g, '');

      return {
        id: index + 1,
        author: author,
        type: type,
        content: {
          es: es,
          en: en,
          fr: fr,
        },
        isFavorite: false,
        hasShown: false,
      };
    });

    // Write the transformed content to the output file
    fs.writeFile(outputFile, JSON.stringify(transformedPhrases, null, 2), 'utf8', err => {
      if (err) {
        console.error('Error writing to the file:', err);
      } else {
        console.log('Transformation complete. Output saved to', outputFile);
      }
    });
  });
}

// Example usage
const inputFile = '../phrases.txt'; // Replace with the actual file path
const outputFile = 'transformed_phrases.json';
transformPhrases(inputFile, outputFile);
