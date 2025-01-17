
// Отвечает за обработку где нету приоретета выбора
async function oneType(order, store_process) {
    const store_process_type = [...store_process];
    const orderSize = order.size[0];
    const orderId = order.id;


    if (!orderSize) {
        return { type: "error", message: "Заказ не содержит информации о размере", id: orderId, size: orderSize };
    }

    for (let i = 0; i < store_process_type.length; i++) {
        if (store_process_type[i].size === orderSize) {
            if (store_process_type[i].quanity > 0) {
                store_process_type[i].quanity -= 1;
                return { type: "result", store_process_type: store_process_type, message: "Заказ успешно обработан", id: orderId, size: orderSize };
            } else {
                return { type: "error", message: "Нет доступного количества товара данного размера", id: orderId, size: orderSize };
            }
        }
    }

    return { type: "error", message: "Нет такого размера в наличии", id: orderId, size: orderSize };
}

// Отвечает за обработку где есть приоритет выбора
async function twoType(order, store_process) {
    const store_process_type = [...store_process];
    const orderSizes = order.size;
    const masterSize = order.masterSize;
    const orderId = order.id;

    if (!orderSizes || orderSizes.length < 2) {
        return { type: "error", message: "Заказ не содержит достаточного количества размеров или их нет", masterSize: false, id: orderId, size: orderSizes };
    }

    if (!masterSize || (masterSize !== "s1" && masterSize !== "s2")) {
        return { type: "error", message: "Не указан или некорректен masterSize", masterSize: false, id: orderId, size: orderSizes };
    }

    const prioritizedSize = masterSize === "s1" ? orderSizes[0] : orderSizes[1];
    const secondarySize = masterSize === "s1" ? orderSizes[1] : orderSizes[0];

    let processedSize; // Добавили переменную для хранения выбранного размера

    // Поиск приоритетного размера
    for (let i = 0; i < store_process_type.length; i++) {
        if (store_process_type[i].size === prioritizedSize && store_process_type[i].quanity > 0) {
            store_process_type[i].quanity -= 1;
            processedSize = prioritizedSize; // Записываем приоритетный размер
            break;
        }
    }

    // Если приоритетный размер найден - возврат
    if (processedSize) {
        return { type: "result", store_process_type: store_process_type, masterSize: true, message: "Заказ обработан по приоритету", id: orderId, size: processedSize };
    }

    // Поиск вторичного размера
    for (let i = 0; i < store_process_type.length; i++) {
        if (store_process_type[i].size === secondarySize && store_process_type[i].quanity > 0) {
            store_process_type[i].quanity -= 1;
            processedSize = secondarySize; // Записываем вторичный размер
            break;
        }
    }

    //Возврат результата или ошибки
    if (processedSize) {
        return { type: "result", store_process_type: store_process_type, masterSize: false, message: "Заказ обработан, но без учёта приоритета", id: orderId, size: processedSize };
    } else {
        return { type: "error", message: "Нет доступных размеров в наличии", masterSize: false, id: orderId, size: orderSizes };
    }
}

// Отвечает за компоновку данных
async function compain(result, error) {
    const stats = {};
    const assignment = [];
    let mismatches = 0;

    for (const res of result) {
        if (res.type === "result") {
            let size = res.processedSize;
            if (size){
                 stats[size] = stats[size] ? stats[size] + 1 : 1;
            } else if (Array.isArray(res.size)){
              for(const size of res.size){
                   stats[size] = stats[size] ? stats[size] + 1 : 1;
              }
            }
             else if(typeof res.size === 'number'){
                 stats[res.size] = stats[res.size] ? stats[res.size] + 1 : 1;
            }

            assignment.push({ id: res.id, size: res.size });

            if (res.masterSize === false) {
                mismatches++;
            }
        }
    }

    const statsArray = Object.entries(stats)
        .map(([size, quantity]) => ({ size: Number(size), quantity }))
        .sort((a, b) => a.size - b.size);

        return [{ stats: statsArray, assignment: assignment, mismatches: mismatches }, error];
}

// Отвечает за пердачу в приоритет выбора и последущию компановку данных
export const process = async (store, order) => {
    let store_process = [...store];
    let result = [];
    let error = [];

    for (let i = 0; i < order.length; i++) {
        if (order[i].size.length > 1) {
            let two_type = await twoType(order[i], store_process);
            if (two_type.type === "result") {
                result.push(two_type); 
                store_process = two_type.store_process_type; 
                continue;
            } else {
                error.push(two_type); 
                continue;
            }
        }
         let one_type = await oneType(order[i], store_process);
            if (one_type.type === "result") {
                result.push(one_type); 
                 store_process = one_type.store_process_type;
                 continue;
            }
            else {
                error.push(one_type); 
                 continue;
            }

    }
    const [ finalResult, finalError ] = await compain(result, error);
    console.log(finalResult);
    console.log(finalError);
};