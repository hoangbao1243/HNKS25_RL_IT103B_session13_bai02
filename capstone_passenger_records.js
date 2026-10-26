const readline = require('readline-sync');

let passengers = [
    { pnrCode: 'VN01', passengerName: 'NGUYEN VAN A', idNumber: '001092012345', flightNumber: 'VN123', seatNumber: '12A', isCheckedIn: true },
    { pnrCode: 'VN02', passengerName: 'TRAN THI B', idNumber: 'C1234567', flightNumber: 'VN123', seatNumber: '', isCheckedIn: false }
];

const availableSeats = ['12B', '12C', '14A', '14B', '15C'];

function isValidId(id) {
    const cccdRegex = /^\d{12}$/;
    const passportRegex = /^[A-Z]\d{7,8}$/;
    return cccdRegex.test(id) || passportRegex.test(id);
}

function findPassenger(keyword) {
    return passengers.find(p => 
        p.pnrCode.toUpperCase() === keyword.toUpperCase() || 
        p.passengerName.toUpperCase().includes(keyword.toUpperCase())
    );
}

function printBoardingPass(p) {
    const width = 46;
    const line = '='.repeat(width);
    console.log(`\n${line}`);
    console.log(`${'THẺ LÊN TÀU BAY (BOARDING PASS)'.padStart(38, ' ')}`);
    console.log(`${line}`);
    console.log(` Hành khách:   ${p.passengerName.padEnd(31)}`);
    console.log(` Mã PNR:       ${p.pnrCode.padEnd(31)}`);
    console.log(` Số hiệu chuyến:${p.flightNumber.padEnd(30)}`);
    console.log(` Số ghế:       ${p.seatNumber.padEnd(31)}`);
    console.log(` Giấy tờ:      ${p.idNumber.padEnd(31)}`);
    console.log(` ${'||\x20||||\x20||\x20|||||\x20||\x20||||'.padStart(35, ' ')}`);
    console.log(`${line}\n`);
}

function checkInSecurity() {
    console.log('\n--- KIỂM TRA AN NINH & CHECK-IN ---');
    let keyword = readline.question('Nhập mã PNR hoặc tên hành khách: ').trim();
    let p = findPassenger(keyword);

    if (!p) {
        console.log('Lỗi: Không tìm thấy hồ sơ hành khách!');
        return;
    }

    if (p.isCheckedIn) {
        console.log('Hành khách này đã hoàn tất thủ tục trước đó.');
        printBoardingPass(p);
        return;
    }

    let id = readline.question('Nhập số CCCD (12 số) hoặc Hộ chiếu: ').trim().toUpperCase();
    if (!isValidId(id)) {
        console.log('Lỗi: Định dạng giấy tờ tùy thân không hợp lệ!');
        return;
    }
    p.idNumber = id;

    if (availableSeats.length === 0) {
        console.log('Lỗi: Chuyến bay đã hết ghế trống!');
        return;
    }

    p.seatNumber = availableSeats.shift();
    p.isCheckedIn = true;

    console.log('Xác thực và check-in thành công!');
    printBoardingPass(p);
}
function addPassenger() {
    console.log('\n--- TIẾP NHẬN HỒ SƠ MỚI ---');
    let pnr = readline.question('Nhập mã PNR: ').trim().toUpperCase();
    if (passengers.some(p => p.pnrCode === pnr)) {
        console.log('Lỗi: Mã PNR đã tồn tại!');
        return;
    }
    let name = readline.question('Nhập tên hành khách: ').trim().toUpperCase();
    let flight = readline.question('Nhập số hiệu chuyến bay: ').trim().toUpperCase();
    let id = readline.question('Nhập số CCCD hoặc Hộ chiếu: ').trim().toUpperCase();

    if (!isValidId(id)) {
        console.log('Lỗi: Giấy tờ tùy thân không hợp lệ!');
        return;
    }
    passengers.push({
        pnrCode: pnr,
        passengerName: name,
        idNumber: id,
        flightNumber: flight,
        seatNumber: '',
        isCheckedIn: false
    });

    console.log('Thêm hồ sơ hành khách thành công!');
}

function listPassengers() {
    console.log('\n' + '='.repeat(85));
    console.log('DANH SÁCH HỒ SƠ HÀNH KHÁCH'.padStart(52, ' '));
    console.log('='.repeat(85));
    console.log('PNR'.padEnd(10) + 'HÀNH KHÁCH'.padEnd(25) + 'GIẤY TỜ'.padEnd(15) + 'CHUYẾN'.padEnd(10) + 'GHẾ'.padEnd(8) + 'TRẠNG THÁI');
    console.log('-'.repeat(85));
    
    passengers.forEach(p => {
        console.log(
            p.pnrCode.padEnd(10) + 
            p.passengerName.padEnd(25) + 
            p.idNumber.padEnd(15) + 
            p.flightNumber.padEnd(10) + 
            (p.seatNumber || 'N/A').padEnd(8) + 
            (p.isCheckedIn ? 'CHECKED_IN' : 'PENDING')
        );
    });
    console.log('='.repeat(85));
}
function main() {
    let choice;
    do {
        console.log('\n================ HỆ THỐNG AN NINH & THỦ TỤC MẶT ĐẤT ================');
        console.log('1. Hiển thị danh sách hồ sơ');
        console.log('2. Tiếp nhận hồ sơ hành khách mới');
        console.log('3. Xác thực & Check-in (Cấp ghế, In thẻ)');
        console.log('4. Thoát chương trình');
        console.log('====================================================================');
        
        choice = parseInt(readline.question('Nhập lựa chọn (1-4): ').trim());

        switch (choice) {
            case 1: listPassengers(); break;
            case 2: addPassenger(); break;
            case 3: checkInSecurity(); break;
            case 4: console.log('Kết thúc phiên làm việc.'); break;
            default: console.log('Lựa chọn không hợp lệ!');
        }
    } while (choice !== 4);
}

main();