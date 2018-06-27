
let objectMaps = {
    'squid': {
        'map':[
            [0,0,0,0,1,1,0,0,0,0],
            [0,0,0,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,0,0],
            [0,1,1,0,1,1,0,1,1,0],
            [0,1,1,1,1,1,1,1,1,0],
            [0,0,0,1,0,0,1,0,0,0],
            [0,0,1,0,1,1,0,1,0,0],
            [0,1,0,1,0,0,1,0,1,0],
        ], 
        'altMap':[
            [0,0,0,0,1,1,0,0,0,0],
            [0,0,0,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,0,0],
            [0,1,1,0,1,1,0,1,1,0],
            [0,1,1,1,1,1,1,1,1,0],
            [0,0,1,0,1,1,0,1,0,0],
            [0,1,0,0,0,0,0,0,1,0],
            [0,0,1,0,0,0,0,1,0,0],
        ],
        'points': 25
    },
    'crab':{
        'map':[
            [0,0,1,0,0,0,0,0,1,0,0],
            [0,0,0,1,0,0,0,1,0,0,0],
            [0,0,1,1,1,1,1,1,1,0,0],
            [0,1,1,0,1,1,1,0,1,1,0],
            [1,1,1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,1,1,1,1,0,1],
            [1,0,1,0,0,0,0,0,1,0,1],
            [0,0,0,1,1,0,1,1,0,0,0],
        ],
        'altMap':[
            [0,0,1,0,0,0,0,0,1,0,0],
            [1,0,0,1,0,0,0,1,0,0,1],
            [1,0,1,1,1,1,1,1,1,0,1],
            [1,1,1,0,1,1,1,0,1,1,1],
            [0,1,1,1,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,1,1,1,0,0],
            [0,0,1,0,0,0,0,0,1,0,0],
            [0,1,0,0,0,0,0,0,0,1,0],
        ],
        'points':50
    },
    'thulu':{
        'map':[
            [0,0,0,0,1,1,1,1,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,0,0,1,1,0,0,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [0,0,0,1,1,0,0,1,1,0,0,0],
            [0,0,1,1,0,1,1,0,1,1,0,0],
            [1,1,0,0,0,0,0,0,0,0,1,1]
            
        ],
        'altMap':[
            [0,0,0,0,1,1,1,1,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,0,0,1,1,0,0,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [0,0,1,1,1,0,0,1,1,1,0,0],
            [0,1,1,0,0,1,1,0,0,1,1,0],
            [0,0,1,1,0,0,0,0,1,1,0,0]
        ],
        'points':75
    },
    'boom':{
        'map':[
            [0,0,0,0,1,0,0,1,0,0,0,0],
            [0,1,0,0,0,0,0,0,0,0,1,0],
            [0,0,0,1,0,1,1,0,1,0,0,0],
            [0,0,0,0,1,0,0,1,0,0,0,0],
            [0,0,0,0,1,0,0,1,0,0,0,0],
            [0,0,0,1,0,1,1,0,1,0,0,0],
            [0,1,0,0,0,0,0,0,0,0,1,0],
            [0,0,0,0,1,0,0,1,0,0,0,0],
        ],
        'altMap':[
            [0,0,0,1,0,0,0,0,1,0,0,0],
            [0,0,0,0,1,0,0,1,0,0,0,0],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [0,0,1,0,0,0,0,0,0,1,0,0],
            [0,0,1,0,0,0,0,0,0,1,0,0],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [0,0,0,0,1,0,0,1,0,0,0,0],
            [0,0,0,1,0,0,0,0,1,0,0,0],
        ]
    },
    'motherShip':{
        "map":[
            [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,1,1,0,1,0,1,0,1,0,1,0,1,1,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [0,0,1,1,1,0,1,1,1,0,1,1,1,0,0],
            [0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
        ],
    },
    'player':{
        "map":[
            [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ]
    },
    'splat':{
        "map1":[
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,1,0,1,0,0],
            [0,0,0,1,0,0,0],
            [0,0,1,0,1,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ],
        "map2":[
            [0,0,0,0,0,0,0],
            [0,1,0,0,0,1,0],
            [0,0,0,1,0,0,0],
            [0,0,1,0,1,0,0],
            [0,0,0,1,0,0,0],
            [0,1,0,0,0,1,0],
            [0,0,0,0,0,0,0]
        ],
        "map3":[
            [1,0,0,0,0,0,1],
            [0,0,1,0,1,0,0],
            [0,1,0,0,0,1,0],
            [0,0,0,0,0,0,0],
            [0,1,0,0,0,1,0],
            [0,0,1,0,1,0,0],
            [1,0,0,0,0,0,1]
        ]
    }
    
}