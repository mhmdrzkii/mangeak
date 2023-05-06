import fetch from "node-fetch";
import {
    v4 as uuidv4
} from 'uuid';
import {
    faker
} from '@faker-js/faker';
import colors from '@colors/colors';
import fs from 'fs';
import delay from 'delay';

async function request(url, method, headers, body = null) {

    const fetchData = {};
    if (method == "POST") {
        fetchData.method = "POST";
        fetchData.body = body;
    } else {
        fetchData.method = "GET";
    }

    fetchData.headers = headers;

    return await fetch(url, fetchData).then(res => res.json())

};

(async () => {

    const numOfAcc = 100;

    for (let i = 0; i < numOfAcc; i++) {

        const uuid = uuidv4();
        const tclId = Math.floor(Math.random() * 900000000) + 100000000;
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const email = (`${firstName}${lastName}${Math.floor(Math.random() * 9999)}@ryzstoree.com`).toLowerCase();
        const password = "moovadigital";

        const headers = {
            'Host': 'api.vidio.com',
            'content-type': 'application/json',
            'x-visitor-id': uuid,
            'x-api-app-info': 'tv-android/7.1.2/1.84.0-405',
            'accept': '*/*',
            'accept-language': 'en',
            'x-api-platform': 'tv-android',
            'referer': 'androidtv-app://com.vidio.android.tv',
            'user-agent': 'tv-android/1.84.0 (405)',
            'x-api-auth': 'laZOmogezono5ogekaso5oz4Mezimew1'
        };

        const register = await request('https://api.vidio.com/api/register', 'POST', headers, `{"password":"${password}","email":"${email}"}`);

        if (register?.auth?.email) {

            const partnerReq = await request('https://www.vidio.com/api/partner/auth', 'POST', headers, `{"serial_number":"${tclId}","partner_agent":"tcl"}`);

            if (partnerReq?.auth?.email) {

                const emailPartner = partnerReq.auth.email;
                const token = partnerReq.auth.authentication_token;

                headers['x-user-email'] = emailPartner;
                headers['x-user-token'] = token;

                const login = await request('https://www.vidio.com/api/login', 'POST', headers, `{"password":"${password}","login":"${email}"}`);

                if (login?.auth?.email) {

                    const emailLogin = login.auth.email;
                    const tokenLogin = login.auth.authentication_token;

                    headers['x-user-email'] = emailLogin;
                    headers['x-user-token'] = tokenLogin;

                    const subscription = await request('https://www.vidio.com/api/users/has_active_subscription', 'GET', headers, '');

                    if (subscription?.has_active_subscription === true) {

                        console.log(colors.green(`Email: ${email} | Password: ${password} | TCL ID: ${tclId} | Subscription: ${subscription.has_active_subscription}`))
                        fs.appendFileSync('result.txt', `${email}|${password}\n`);
                    } else {
                        console.log(colors.red(`Email: ${email} | Password: ${password} | TCL ID: ${tclId} | Subscription: ${subscription.has_active_subscription}`))
                    }

                } else {
                    console.log(colors.red(`Email: ${email} | Password: ${password} | TCL ID: ${tclId} | Error: ${login.error}`))
                }

            } else {
                console.log(colors.red(`Email: ${email} | Password: ${password} | TCL ID: ${tclId} | Error: ${partnerReq.error}`))
            }
        } else {
            console.log(colors.red(`Email: ${email} | Password: ${password} | TCL ID: ${tclId} | Error: ${register.error}`))
        }
        await delay(2000);
    }

})()
