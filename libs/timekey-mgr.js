'use strict';
const aryUsrKey = [];
const DEBUG = true; 	// Debug，show所有訊息
const RUNTEST = false;	// 執行測試程式，這個要單獨run timekey-mgr.js
const refreshTime = RUNTEST ? 30 : 60 * 3; // Debug是30秒，非Debug是5分鐘

// 效用說明：
// 代入userId後，如果是新的使用者，會拿不到key，但是接下來一個時間(5min)內都可以拿到key。
// 無論有沒有拿到key，只要呼叫isKeyExist拿key，基本上接下來一段時間(5min)內都可以拿到key。
// 在這段時間內，如果去拿key，除了可以拿到key之外，可以拿到key的時間會被刷新(5min)。
//
//* userId: DC的使用者ID
//* return:{id:dc的使用者id, count:在時間內發問幾次，涉及gpt要傳幾個訊息}

function _getKey(userId) {
	let idx = aryUsrKey.findIndex((usr) => usr.id === userId);
	if (idx === -1) {
		aryUsrKey.push({
			id: userId,
			key: true,
			count: 1,
		});
		idx = aryUsrKey.length - 1;
		aryUsrKey[idx].timer = setTimeout(() => {
			aryUsrKey[idx].key = false;
			aryUsrKey[idx].count = 0;
			if (DEBUG) console.log('new user - setTimeout finish. - ' + idx);
		}, refreshTime * 1000);
		if (DEBUG) console.log('new user - ' + idx);
	} else {
		if (!aryUsrKey[idx].key) {
			aryUsrKey[idx].key = true;
			aryUsrKey[idx].count = 1;
			aryUsrKey[idx].timer = setTimeout(() => {
				aryUsrKey[idx].key = false;
				aryUsrKey[idx].count = 0;
				if (DEBUG) console.log('old user, timeout - setTimeout finish. - ' + idx);
			}, refreshTime * 1000);
			if (DEBUG) console.log('old user, timeout - ' + idx);
		} else {
			aryUsrKey[idx].count++;
			clearTimeout(aryUsrKey[idx].timer);
			aryUsrKey[idx].timer = setTimeout(() => {
				aryUsrKey[idx].key = false;
				aryUsrKey[idx].count = 0;
				if (DEBUG) console.log('old user, not timeout yet - setTimeout finish. - ' + idx);
			}, refreshTime * 1000);
			if (DEBUG) console.log('old user, not timeout yet - ' + idx);
		}
	}
	return { id: aryUsrKey[idx].id, count: aryUsrKey[idx].count };
}

function _test() {
	console.log(_getKey('101'));
	console.log(_getKey('102'));

	setInterval(() => {
		aryUsrKey.forEach((usr) => {
			console.log(usr.id + ' - ' + (usr.key ? 'valid' : 'invalid') + ' - ' + usr.count);
		});
		console.log('-');
	}, 3 * 1000);

	setTimeout(() => {
		console.log(_getKey('101'));
	}, 10 * 1000);

	setTimeout(() => {
		console.log(_getKey('103'));
	}, 4 * 1000);

	setTimeout(() => {
		console.log(_getKey('103'));
	}, 10 * 1000);

	setTimeout(() => {
		console.log(_getKey('102'));
	}, 50 * 1000);

	setTimeout(() => {
		console.log(_getKey('102'));
	}, 51 * 1000);

	setTimeout(() => {
		console.log(_getKey('102'));
	}, 52 * 1000);

	setTimeout(() => {
		console.log(_getKey('102'));
	}, 53 * 1000);
}

(() => {
	if (RUNTEST) _test();
})();

module.exports = {
	getKey: _getKey,
};
