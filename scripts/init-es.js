const fs = require('fs');
const fetch = require('node-fetch');
const stream = require('stream');

const sql2json = require('../lib/sql2json');

function getRawJSONData() {
  return new Promise((resolve, reject) => {
    const dumpPath = process.argv[2];
    if (!dumpPath) {
      reject('Не указан путь к дампу базы данных. Пример: node scripts/init-es etc/database/dump.sql');
      return;
    }
  
    fs.readFile(dumpPath, 'utf8', (error, sql) => {
      if (error) {
        reject(`Проблема с чтением дампа базы данных: ${error}`);
        return;
      }
    
      let json;
      try {
        json = sql2json(sql);
      } catch (error) {
        reject(`Проблема с конвертацией дампа базы данных в JSON: ${error}`);
        return;
      }

      resolve(json);
    });
  });
}

function prepareESJSONData(rawData) {
  return rawData.reduce((result, item) => {
    return `${result}{"index":{"_id":"${item.id}"}}\n${JSON.stringify(item)}\n`;
  }, '');
}

function createESIndex(indexName) {
  return fetch(`http://localhost:9200/${indexName}?pretty`, {
    method: 'PUT',
  });
}

async function loadToES(indexName, data) {
  const body = new stream.Readable();
  body.push(data);
  body.push(null);

  return fetch(`http://localhost:9200/${indexName}/_doc/_bulk?pretty&refresh`, {
    body,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });
}

async function prepareAndLoadToES(indexName, rawData) {
  if (!rawData) {
    throw new Error(`Нет данных для ${indexName}. Проверьте дамп базы данных и скрипт`);
  }

  console.log(`Грузим индекс ${indexName}`);

  const esJSONData = prepareESJSONData(rawData);

  await createESIndex(indexName);
  await loadToES(indexName, esJSONData);

  console.log(`Индекс ${indexName} загружен`);
}

async function processRawJSONData(json) {
  await prepareAndLoadToES('courses', json.courses);
  await prepareAndLoadToES('professions', json.professions);
  await prepareAndLoadToES('skills', json.skills);
  await prepareAndLoadToES('vacancies', json.vacancies);
}

getRawJSONData()
  .then(processRawJSONData)
  .then(() => {
    console.log('Готово!');
  })
  .catch(error => {
    console.error(error);
  });
