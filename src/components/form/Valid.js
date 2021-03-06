const trim = function(str){ //删除左右两端的空格
　　     return str.replace(/(^\s*)|(\s*$)/g, '');
　　 }
const rules = {
    digits: [/^\d+$/, '请输入数字'],
    mobile: [/^1[3-9]\d{9}$/, '请输入有效的手机号'],
    email: [/^[\w\+\-]+(\.[\w\+\-]+)*@[a-z\d\-]+(\.[a-z\d\-]+)*\.([a-z]{2,4})$/i, '请输入有效的邮箱'],
    chinese: [/^[\u0391-\uFFE5]+$/, '请输入中文字符'],
    password: [/^[\S]{6,16}$/, '请输入6-16位字符，不能包含空格'],
    passwordPlus: function(val) {
    	var value = val;
        if(/^[\S]{6,16}$/.test(value)) {
            var rule1 = /\d/.test(value) ? 1 : 0;
            var rule2 = /[A-Za-z]/.test(value) ? 1 : 0;
            var rule3 = /[^a-zA-Z0-9]/.test(value) ? 1 : 0;
            if(rule1 + rule2 + rule3 < 2) {
                return false;
            }
        }else{
            return false;
        }
        
        return true;
    },
    tel: [/^(?:(?:0\d{2,3}[\- ]?[1-9]\d{6,7})|(?:[48]00[\- ]?[1-9]\d{6}))$/, '请输入有效的电话号码'],
    money: [/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/, '请输入有效的金额'],
    // 银行卡（借记卡）
    bankcard: function(val) {
        var value = val.replace(/\s/g, ''),
            isValid = true,
            rFormat = /^[\d]{12,19}$/;

        if (!rFormat.test(value)) {
            isValid = false;
        } else {
            var arr = value.split('').reverse(),
                i = arr.length,
                temp,
                sum = 0;

            while (i--) {
                if (i % 2 === 0) {
                    sum += +arr[i];
                } else {
                    temp = +arr[i] * 2;
                    sum += temp % 10;
                    if (temp > 9) sum += 1;
                }
            }
            if (sum % 10 !== 0) {
                isValid = false;
            }
        }
        //return isValid || '请填写有效的银行卡号';
        return isValid;
    },

    // 组织机构代码证
    orgcode: function(val) {
        var value = val,
            isValid = true,
            rFormat = /^[A-Z\d]{8}-[X\d]/;

        if (!rFormat.test(value)) {
            isValid = false;
        } else {
            var Wi = [3, 7, 9, 10, 5, 8, 4, 2];
            var Ci = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            // 加权求和
            var sum = 0;
            for (var i = 0; i < 8; i++) {
                sum += Ci.indexOf(value.charAt(i)) * Wi[i];
            }
            // 计算校验值： C9 = 11 - MOD ( ∑(Ci*Wi), 11 )
            var C9 = 11 - (sum % 11);
            if (C9 === 10) C9 = 'X';
            else if (C9 === 11) C9 = 0;
            C9 = '' + C9;
            // 与校验位比对
            if (C9 !== value.charAt(9)) {
                isValid = false;
            }
        }
        //return isValid || "请填写正确的组织机构代码";
        return isValid;
    },

    // 营业执照号
    buscode: function(val) {
        var value = val,
            isValid = true,
            rFormat = /^[1-6]\d{14}$/;

        // 共15位：6位首次登记机关代码 + 8位顺序码 + 校验位
        if (!rFormat.test(value)) {
            isValid = false;
        } else {
            var s = [],
                p = [10];

            for (var i = 0; i < 15; i++) {
                s[i] = (p[i] % 11) + (+value.charAt(i));
                p[i + 1] = (s[i] % 10 || 10) * 2;
            }
            if (1 !== s[14] % 10) {
                isValid = false;
            }
        }
        //return isValid || "请填写正确的营业执照号";
        return isValid;
    },

    // 统一社会信用代码校验
    // 计算最后校验位：C18 = 31 - MOD ( ∑(Ci*Wi), 31 )
    creditcode: function(val) {
        var str = val + '';
        var roughReg = /[IOZVS]/;
        var specificReg = /^((1[1239])|(5[1239])|(9[123])|(Y1))\d{6}[0-9ABCDEFGHJKLMNPQRTUWXY]{9}$/;    // 前17位
        var baseMap = {};    // 存放基数的Map
        var allow = 'ABCDEFGHJKLMNPQRTUWXY'.split('');    // 允许的英文字母（用来生成字母的基数对照表）
        var weighting = [1,3,9,27,19,26,16,17,20,29,25,13,8,24,10,30,28];    // 加权因子
        var letterReg = /^[A-Z]$/;

        var first17 = str.slice(0, str.length-1);
        //var arr = str.split('');

        if (str.length !== 18) return false;
        if (roughReg.test(str) === true) return false;
        if (specificReg.test(first17) !== true) return false;

        // 生成字母的基数对照表
        for(var i=0, len=allow.length, base=10; i<len; i++, base++) {
            baseMap[ allow[i] ] = base;
        }

        // 基数和对应位数的加权因子数值相乘，并把乘积求和
        var sum = 0;
        for(var j=0, leng=first17.length; j<leng; j++) {
            if ( letterReg.test(first17[j]) === true ) {
                sum += parseInt( baseMap[ first17[j] ] ) * weighting[j];
            } else {
                sum += parseInt( first17[j] ) * weighting[j];
            }
        }

        // 对总和进行31求余，得到余数
        var rest = sum % 31;
        // 用31减去余数，0-9直接作为校验码，其余的在基数对照表查找
        var minus = 31 - rest;
        var validChar;
        if (minus >= 10) {
            if (minus != 31) {
                for(var k in baseMap) {
                    if (baseMap.hasOwnProperty(k) && baseMap[k] === minus) {
                        validChar = k;
                        break;
                    }
                }
            } else {
                // 特殊情况，总和刚好被31整除，这样算0
                validChar = 0;
            }

        } else {
            validChar = minus;
        }
        // 和最后一位做比较
        if (str[17] == validChar) {
            return true;
        } else {
            return false;
        }
    },
    IDcard: [/^\d{6}(19|2\d)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)?$/, '请输入正确的身份证号码'],
    idcard: function(val) {
        var value = val,
            isValid = true;
        var cityCode = {
            11: '北京',
            12: '天津',
            13: '河北',
            14: '山西',
            15: '内蒙古',
            21: '辽宁',
            22: '吉林',
            23: '黑龙江 ',
            31: '上海',
            32: '江苏',
            33: '浙江',
            34: '安徽',
            35: '福建',
            36: '江西',
            37: '山东',
            41: '河南',
            42: '湖北 ',
            43: '湖南',
            44: '广东',
            45: '广西',
            46: '海南',
            50: '重庆',
            51: '四川',
            52: '贵州',
            53: '云南',
            54: '西藏 ',
            61: '陕西',
            62: '甘肃',
            63: '青海',
            64: '宁夏',
            65: '新疆',
            71: '台湾',
            81: '香港',
            82: '澳门',
            91: '国外 '
        };

        /* 15位校验规则： (dddddd yymmdd xx g)    g奇数为男，偶数为女
         * 18位校验规则： (dddddd yyyymmdd xxx p) xxx奇数为男，偶数为女，p校验位

         校验位公式：C17 = C[ MOD( ∑(Ci*Wi), 11) ]
         i----表示号码字符从由至左包括校验码在内的位置序号
         Wi 7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2 1
         Ci 1 0 X 9 8 7 6 5 4 3 2
         */
        var rFormat = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/; // 格式验证

        if (!rFormat.test(value) || !cityCode[value.substr(0, 2)]) {
            isValid = false;
        }
        // 18位身份证需要验证最后一位校验位
        else if (value.length === 18) {
            var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
            var Ci = '10X98765432'; // 校验字符
            // 加权求和
            var sum = 0;
            for (var i = 0; i < 17; i++) {
                sum += value.charAt(i) * Wi[i];
            }
            // 计算校验值
            var C17 = Ci.charAt(sum % 11);
            // 与校验位比对
            if (C17 !== value.charAt(17)) {
                isValid = false;
            }
        }
        return isValid;
    }
};
const valid = function(value, rule) {
    value = value || '';
    value = String(value);
    if(rule) {
        const ruleList = rule.split(';');
        value = trim(value);

        for(var j = 0,rlen=ruleList.length;j < rlen;j++) {
            var curRule = trim(ruleList[j]);
            if(value === '') {
                if(curRule === 'required') {
                    ////me.focusOnError($cur);
                    //console.log(99,value);
                    return false;
                }
            }else{
                if(curRule !== '') {
                    if( /^length/.test(curRule) ) {
                        var min = curRule.match(/\d+~/);
                        var max = curRule.match(/~\d+/);
                        min = min === null ? min : min[0].replace('~','');
                        max = max === null ? max : max[0].replace('~','');
                        if(min&& value.length < min) {
                            ////me.focusOnError($cur);
                            return false;
                        }
                        if(max&& value.length > max) {
                            ////me.focusOnError($cur);
                            return false;
                        }
                    }else if( /^range/.test(curRule) ) {
                        console.log('range');
                        var minR = curRule.match(/\d+~/);
                        var maxR = curRule.match(/~\d+/);
                        value = Number(value);
                        if(isNaN(value) || value < minR[0].replace('~','') || value > maxR[0].replace('~','')) {
                            ////me.focusOnError($cur);
                            return false;
                        }
                    }else if( Object.prototype.toString.call( rules[curRule] ) === '[object Array]') {
                        var reg = rules[curRule][0];
                        if( !reg.test(value) )  {
                            //me.focusOnError($cur);
                            return false;
                        }
                    }else if( typeof rules[curRule] === 'function' ) {
                        if( rules[curRule](value) !== true ) {
                            //me.focusOnError($cur);
                            return false;
                        }
                    //自定义正则规则
                    }else if( /^\//.test(curRule) ) {
                        var inputstring = curRule;
                        var flags = inputstring.replace(/.*\/([gimy]*)$/, '$1');
                        var pattern = inputstring.replace(new RegExp('^/(.*?)/'+flags+'$'), '$1');
                        var cReg = new RegExp(pattern, flags);
                        //console.log(curRule, value);
                        if(!cReg.test(value)) {
                            //me.focusOnError($cur);
                            return false;
                        }
                    }
                }
            }
        }
    }
    	   
    return true;
};


export default valid