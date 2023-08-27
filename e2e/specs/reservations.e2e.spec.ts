describe('Reservations', () => {

    let jwt: string;

    beforeAll(async () => {
        const user = {
            email: 'email@example.com',
            password: 'StrongPass123!'
        };

        await fetch('http://auth:3001/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        });

        const response = await fetch('http://auth:3001/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        });
        jwt = await response.text();
    });

    test('Create n Get', async () => {
        const createdReservation = await createReservaion();
        const responseGet = await fetch(`http://reservations:3000/reservations/${createdReservation._id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authentication: jwt
            },
        });
        const reservation = await responseGet.json();
        expect(createdReservation).toEqual(reservation);
    });

    const createReservaion = async () => {
        const responseCreate = await fetch('http://reservations:3000/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authentication: jwt
            },
            body: JSON.stringify({
                "startDate": "2021-01-01",
                "endDate": "2021-01-05",
                "placeId": "123",
                "invoiceId": "111",
                "charge": {
                    "amount": 100,
                    "card": {
                        "cvc": "413",
                        "exp_month": 12,
                        "exp_year": 2027,
                        "number": "4242 4242 4242 4242"
                    }
                }
            }),
        });
        expect(responseCreate.ok).toBeTruthy();
        return await responseCreate.json();
    }
});