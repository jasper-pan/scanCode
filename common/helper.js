function test (){
	console.log('test方法');
}

function IsURL(str_url) {
    return (/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm).test(str_url);
}

function AnalysisURL(url) {
    return /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i.exec(url);
}

function CurentTime() {
				var now = new Date();
				var year = now.getFullYear(); //年
				var month = now.getMonth() + 1; //月
				var day = now.getDate(); //日
				var hh = now.getHours(); //时
				var mm = now.getMinutes(); //分
				var ss = now.getSeconds(); //分

				var clock = year;

				if (month < 10)
					clock += "0";

				clock += month;

				if (day < 10)
					clock += "0";

				clock += day;

				if (hh < 10)
					clock += "0";

				clock += hh;
				if (mm < 10) clock += '0';

				clock += mm;

				return clock
			}
function deepCopy(target){ 
			let copyed_objs = [];//此数组解决了循环引用和相同引用的问题，它存放已经递归到的目标对象 
			    function _deepCopy(target){ 
			        if((typeof target !== 'object')||!target){return target;}
			        for(let i= 0 ;i<copyed_objs.length;i++){
			            if(copyed_objs[i].target === target){
			                return copyed_objs[i].copyTarget;
			            }
			        }
			        let obj = {};
			        if(Array.isArray(target)){
			            obj = [];//处理target是数组的情况 
			        }
			        copyed_objs.push({target:target,copyTarget:obj}) 
			        Object.keys(target).forEach(key=>{ 
			            if(obj[key]){ return;} 
			            obj[key] = _deepCopy(target[key]);
			        }); 
			        return obj;
			    } 
			    return _deepCopy(target);
			}
const permission = {
	test:test,
	IsURL:IsURL,
	AnalysisURL:AnalysisURL,
	CurentTime:CurentTime,
	deepCopy:deepCopy
}

module.exports = permission