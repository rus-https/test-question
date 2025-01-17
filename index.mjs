import { process } from "./process.mjs";
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

// хранилище масок
let store = [{
    size: 1,
    quanity: 1
},{
    size: 2,
    quanity: 1
},{
    size: 3,
    quanity: 1
},]

// Хранилище заказов
let order = [{id:100,size:[1]},
{id:101,size:[2]},
{id:102,size:[2,3],masterSize:"s1"},
{id:103,size:[1,2],masterSize:"s2"}
]


async function main () {
    await process(store,order)
}
main()









/* Для индвидуальных проверок что бы лучше понимать очиститите массив order и уберите коментарии
// Айди юзера который делает заказ
const id_user = 3

// Интерфейс ввода
const rl = readline.createInterface({ input, output });


async function size() {
    let size = [];
    let a = true;
    console.log("Выберите размер маски");

    for (let i = 0; i < 2; i++) {
      while (a === true) {
          const inputSize = await rl.question("Введите размер: ");
          const size_count = Number(inputSize)

            if (isNaN(size_count)) {
                console.log("Кол-во должно указыватся цифрой");
                continue
              }
              if(size_count <= 0){
                 console.log("Кол-во должно быть больше нуля")
                 continue;
              }
              if (!Number.isInteger(size_count)) {
                  console.log("Размер должен быть целым числом");
                  continue;
              }
              if(size.includes(size_count)) {
                console.log("Повторный размер маски, введите другой.")
                continue;
              }
                size.push(size_count);
                a = false;
      }
      if(size.length === 2){
        return size
      }
        const addMore =  await rl.question("Хотите добавить еще 1 размер маски? Наберите false если больше не надо: ");
          if(addMore.toLowerCase() === 'false') {
               rl.close()
             return size
          }
        a = true;
    }
    rl.close()
     return size
}

async function masterSize(sizes) {
        console.log(sizes)
        const inputmasterSize= await rl.question("Выберите приоретный размер маски нажмите цифру 1 - если первая в ином случае выбирается вторая: ");
        if(inputmasterSize === "1"){
            return "s1"
        }
        return "s2"
}

async function main(){
    const sizes =  await size()
    if(sizes.length > 1){
    const masterSizes =  await masterSize(sizes)
    order.push({id: id_user, size: sizes, masterSize: masterSizes})
    console.log(order)
    await process(store,order)
    return main
    }
    order.push({id: id_user, size: sizes})
    console.log(order)
    await process(store,order)
    return main
}
main()
*/