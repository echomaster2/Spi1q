import * as fs from 'fs';

const content = fs.readFileSync('App.tsx', 'utf8');
const lines = content.split('\n');

// Find the line with "const lessonContent = externalLessonContent;"
const startIndex = lines.findIndex(line => line.includes('const lessonContent = externalLessonContent;'));

// Find the line with "const staticNarrationScripts: Record<string, string> = {"
const endIndex = lines.findIndex(line => line.includes('const staticNarrationScripts: Record<string, string> = {'));

if (startIndex !== -1 && endIndex !== -1) {
  // We want to keep up to startIndex + 1 (to keep the empty line after it, or just startIndex)
  // And we want to keep from endIndex - 1 (the empty line before it)
  const newLines = [
    ...lines.slice(0, startIndex + 1),
    '',
    ...lines.slice(endIndex - 1)
  ];
  fs.writeFileSync('App.tsx', newLines.join('\n'));
  console.log('Successfully removed redundant lines.');
} else {
  console.log('Could not find start or end index.', startIndex, endIndex);
}
