const cleanJSONParse = (text: string) => JSON.parse(text.replace(/```json\s*/g, '').replace(/```/g, '').trim());

export default cleanJSONParse;


