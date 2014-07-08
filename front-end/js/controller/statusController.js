var statusController = angular.module("statusController", ['ngResource']);

statusController.controller("StatusController", function($scope, $http, $routeParams) {
    $http.get('/admin/status?token=' + sessionStorage.getItem("authToken")).success(function (status) {
        drawDiskSpacePie(status.disk);
        drawMemoryPie(status.memory);
    });
});

function drawDiskSpacePie (disk) {
    var pie = new d3pie("diskSpacePie", {
        "header": {
            "title": {
                "text": "Disk space",
                "fontSize": 24,
                "font": "open sans"
                },
            "subtitle": {
                "color": "#999999",
                "fontSize": 12,
                "font": "open sans"
                },
            "titleSubtitlePadding": 9
            },
        "footer": {
            "color": "#999999",
            "fontSize": 10,
            "font": "open sans",
            "location": "bottom-left"
            },
        "size": {
            "canvasWidth": 590
            },
        "data": {
            "sortOrder": "value-desc",
            "content": [
                {
                    "label": "Occupied",
                    "value": Math.round((disk.total - disk.free) / 1024 / 1024 / 1024),
                    "color": "#e23a6f"
                    },
                {
                    "label": "Free",
                    "value": Math.round(disk.free / 1024 / 1024 / 1024),
                    "color": "#248838"
                    }
                ]
            },
        "labels": {
            "outer": {
                "format": "label-value1",
                "pieDistance": 32
                },
            "inner": {
                "hideWhenLessThanPercentage": 3
                },
            "mainLabel": {
                "fontSize": 11
                },
            "percentage": {
                "color": "#ffffff",
                "decimalPlaces": 0
                },
            "value": {
                "color": "#adadad",
                "fontSize": 11
                },
            "lines": {
                "enabled": true
                }
            },
        "effects": {
            "pullOutSegmentOnClick": {
                "effect": "linear",
                "speed": 400,
                "size": 8
                }
            },
        "misc": {
            "gradient": {
                "enabled": true,
                "percentage": 100
                }
            }
        });
}

function drawMemoryPie (memory) {
    var pie = new d3pie("memoryPie", {
        "header": {
            "title": {
                "text": "Memory",
                "fontSize": 24,
                "font": "open sans"
                },
            "subtitle": {
                "color": "#999999",
                "fontSize": 12,
                "font": "open sans"
                },
            "titleSubtitlePadding": 9
            },
        "footer": {
            "color": "#999999",
            "fontSize": 10,
            "font": "open sans",
            "location": "bottom-left"
            },
        "size": {
            "canvasWidth": 590
            },
        "data": {
            "sortOrder": "value-desc",
            "content": [
                {
                    "label": "Occupied",
                    "value": Math.round((memory.total - memory.free) / 1024 / 1024 / 1024),
                    "color": "#e23a6f"
                    },
                {
                    "label": "Free",
                    "value": Math.round(memory.free / 1024 / 1024 / 1024),
                    "color": "#248838"
                    }
                ]
            },
        "labels": {
            "outer": {
                "format": "label-value1",
                "pieDistance": 32
                },
            "inner": {
                "hideWhenLessThanPercentage": 3
                },
            "mainLabel": {
                "fontSize": 11
                },
            "percentage": {
                "color": "#ffffff",
                "decimalPlaces": 0
                },
            "value": {
                "color": "#adadad",
                "fontSize": 11
                },
            "lines": {
                "enabled": true
                }
            },
        "effects": {
            "pullOutSegmentOnClick": {
                "effect": "linear",
                "speed": 400,
                "size": 8
                }
            },
        "misc": {
            "gradient": {
                "enabled": true,
                "percentage": 100
                }
            }
        });
}
