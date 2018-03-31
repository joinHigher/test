/**
 * Created by Liu.Jun on 2018/1/24.
 */

// 需要前端写死 .....
const config = [
    {
        id: 1,
        name: 'banner17 商品分类模板',
        modules: [
            {
                name: 'module1',
                title: '模块1',
                goodsNum: [1, 3]    // [min max]
            },
            {
                name: 'module2',
                title: '模块2',
                goodsNum: [1, 2]
            },
            {
                name: 'module3',
                title: '模块3',
                goodsNum: [1, 2]
            },
            {
                name: 'module4',
                title: '模块4',
                goodsNum: [1, 2]
            },
            {
                name: 'module5',
                title: '模块5',
                goodsNum: [4, 12]
            }
        ]
    }
]

function getModulesById(id) {
    let data
    config.some(item => {
        if (id === item.id) {
            data = item.modules
            return true
        }
    })
    return data
}

export function getTypes() {
    return config.map(item => ({
        id: item.id,
        name: item.name
    }))
}

export function getEmptyGoodsItem() {
    return {
        goodsSn: '',
        wareCode: '',
        image: '',
        coupon: ''
    }
}

export function getEmptyGoods(length) {
    return {
        other: 0,   // 0 1 2 3
        color: {
            title: '#000',
            price: 'red',
            background: '#FFF'
        },
        goods: (function (length) {
            let goods = new Array(length)
            for (let i = 0; i < length; i++) {
                goods[i] = getEmptyGoodsItem()
            }
            return goods
        }(length))
    }
}

export default function (tpId = 1) {
    const modules = getModulesById(tpId)

    if (modules) {
        return modules.map(item => {
            return {
                ...item,
                goodsNum: [...item.goodsNum],
                ...getEmptyGoods(item.goodsNum[0])
            }
        })
    } else {
        return []
    }
}
