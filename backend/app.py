from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import bcrypt
import uuid
import random
import datetime
import requests
from cryptography.fernet import Fernet, InvalidToken


app = Flask(__name__)
CORS(app)

KEY_FILE = 'secret.key'
DATA_FILE = 'users.json'

def generate_key():
    key = Fernet.generate_key()
    with open(KEY_FILE, 'wb') as key_file:
        key_file.write(key)
    return key

def load_key():
    if os.path.exists(KEY_FILE):
        with open(KEY_FILE, 'rb') as key_file:
            return key_file.read()
    else:
        return generate_key()

key = load_key()
cipher = Fernet(key)

def encrypt_field(value):
    return cipher.encrypt(value.encode()).decode()

def decrypt_field(value):
    return cipher.decrypt(value.encode()).decode()

if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump([], f)

def write_users(users):
    for user in users:
        user['email'] = encrypt_field(user['email'])
        user['phone_number'] = encrypt_field(user['phone_number'])
        user['password'] = encrypt_field(user['password'])
        user['account_balance'] = encrypt_field(str(user['account_balance']))
        for request in user['requests']:
            request['reason'] = encrypt_field(request['reason'])
            request['from_iban'] = encrypt_field(request['from_iban'])
    with open(DATA_FILE, 'w') as f:
        json.dump(users, f, indent=4)

def read_users():
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, 'r') as f:
            users = json.load(f)
            for user in users:
                user['email'] = decrypt_field(user['email'])
                user['phone_number'] = decrypt_field(user['phone_number'])
                user['password'] = decrypt_field(user['password'])
                user['account_balance'] = float(decrypt_field(user['account_balance']))
                for request in user['requests']:
                    request['reason'] = decrypt_field(request['reason'])
                    request['from_iban'] = decrypt_field(request['from_iban'])
            return users
    except (json.JSONDecodeError, ValueError, InvalidToken):
        return []

def generate_iban():
    country_code = 'RO'
    check_digits = str(random.randint(10, 99))
    bank_code = 'BANK'
    account_number = ''.join([str(random.randint(0, 9)) for _ in range(16)])
    return f'{country_code}{check_digits}{bank_code}{account_number}'

def find_by_iban(users, iban):
    for index, user in enumerate(users):
        if user.get('IBAN') == iban:
            return index
    return -1

def find_by_phone(users, phone_number):
    for index, user in enumerate(users):
        if user.get('phone_number') == phone_number:
            return index
    return -1

@app.route('/')
def home():
    return "Banking API"

# User registration endpoint
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    phone_number = data.get('phone_number')
    password = data.get('password')
    nume = data.get('name')
    prenume = data.get('surname')

    if not (username and email and phone_number and password and nume and prenume):
        return jsonify({'error': 'All fields are required!'}), 400

    users = read_users()
    if any(user['username'] == username for user in users):
        return jsonify({'error': 'Username already exists!'}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user = {
        'uid': str(uuid.uuid4()),
        'username': username,
        'email': email,
        'name': nume,
        'surname': prenume,
        'phone_number': phone_number,
        'password': hashed_password.decode('utf-8'),
        'IBAN': generate_iban(),
        'account_balance': 1000.0,
        'history_transactions': [],
        'managed_accounts': [],
        "requests": []
    }
    users.append(user)
    write_users(users)
    return jsonify({'message': 'User registered successfully!', 'uid': user['uid']}), 201

# User login endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not (username and password):
        return jsonify({'error': 'Username and password are required!'}), 400

    users = read_users()
    user = next((user for user in users if user['username'] == username), None)

    if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({'message': 'Login successful!', 'user': user}), 200
    else:
        return jsonify({'error': 'Invalid username or password!'}), 401

@app.route('/send_money', methods=['POST'])
def send_money():
    data = request.get_json()
    from_iban = data.get('from_iban')
    to_iban = data.get('to_iban')
    to_phone_number = data.get('to_phone_number')
    to_name = data.get('to_name')
    to_reason = data.get('to_reason')
    amount = data.get('amount')

    if not (from_iban and (to_iban or to_phone_number) and to_name and to_reason and amount):
        return jsonify({'error': 'All fields are required!'}), 400

    try:
        amount = float(amount)
        if amount <= 0:
            return jsonify({'error': 'Amount must be greater than zero!'}), 400
    except ValueError:
        return jsonify({'error': 'Invalid amount!'}), 400

    users = read_users()
    sender_index = find_by_iban(users, from_iban)

    if sender_index == -1:
        return jsonify({'error': 'Sender IBAN not found!'}), 404

    if to_iban:
        receiver_index = find_by_iban(users, to_iban)
    else:
        receiver_index = find_by_phone(users, to_phone_number)

    if receiver_index == -1:
        return jsonify({'error': 'Receiver not found!'}), 404

    sender = users[sender_index]
    receiver = users[receiver_index]

    if sender['account_balance'] < amount:
        return jsonify({'error': 'Insufficient funds!'}), 400

    sender['account_balance'] -= amount
    receiver['account_balance'] += amount

    transaction = {
        'from': from_iban,
        'to': to_iban if to_iban else receiver['IBAN'],
        'amount': amount,
        'timestamp': str(datetime.datetime.utcnow()),
        'to_name': to_name,
        'to_reason': to_reason
    }
    sender['history_transactions'].append(transaction)
    receiver['history_transactions'].append(transaction)

    write_users(users)
    return jsonify({'message': 'Transaction successful!'}), 200

@app.route('/create_extra_account', methods=['POST'])
def create_extra_account():
    data = request.get_json()
    user_id = data.get('user_id')
    account_name = data.get('account_name')
    initial_balance = data.get('initial_balance', 0.0)

    if not (user_id and account_name):
        return jsonify({'error': 'User ID and account name are required!'}), 400

    try:
        initial_balance = float(initial_balance)
        if initial_balance < 0:
            return jsonify({'error': 'Initial balance cannot be negative!'}), 400
    except ValueError:
        return jsonify({'error': 'Invalid initial balance!'}), 400

    users = read_users()
    user = next((user for user in users if user['uid'] == user_id), None)

    if not user:
        return jsonify({'error': 'User not found!'}), 404

    extra_account = {
        'IBAN': generate_iban(),
        'account_name': account_name,
        'account_balance': initial_balance
    }
    user['managed_accounts'].append(extra_account)
    write_users(users)
    return jsonify({'message': 'Extra account created successfully!', 'extra_account': extra_account}), 201

@app.route('/pay_tax_investment', methods=['POST'])
def pay_tax_investment():
    data = request.get_json()
    iban = data.get('iban')
    invested_amount = data.get('invested_amount')
    final_amount = data.get('final_amount')
    pay_tax = data.get('pay_tax')
    profit_amount = final_amount - invested_amount

    if profit_amount <= 0:
        pay_tax = False
    
    users = read_users()
    payer = users[find_by_iban(users,iban)]

    if payer['account_balance'] < invested_amount:
        return jsonify({'error': 'You can\'t invest more than you have!'}), 400

    payer['account_balance'] += profit_amount

    transaction_1 = {
        'from': "Investitii online",
        'to': iban,
        'amount': profit_amount,
        'timestamp': str(datetime.datetime.utcnow()),
        'to_name': payer.get('name') + " " + payer.get('surname'),
        'to_reason': "Profit primit din investitii"
    }
    payer['history_transactions'].append(transaction_1)

    if pay_tax == True:
        tax_amount = profit_amount / 10
        payer['account_balance'] -= tax_amount
        transaction_2 = {
            'from': iban,
            'to': 'RO37TREZ40620300113XXXXX',
            'amount': tax_amount,
            'timestamp': str(datetime.datetime.utcnow()),
            'to_name': "ANAF",
            'to_reason': "Plata taxe profit crypto"
        }
        payer['history_transactions'].append(transaction_2)

    write_users(users)
    return jsonify({'message': 'Transaction successful!'}), 200

@app.route('/find_branches', methods=['GET'])
def find_branches():
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')
    
    if not latitude or not longitude:
        return jsonify({'error': 'Latitude and longitude are required!'}), 400

    # Google Places API endpoint
    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={latitude},{longitude}&radius=10000&type=bank&keyword=UniCredit&key={API_KEY}"
    
    response = requests.get(url)
    if response.status_code == 200:
        places = response.json().get('results', [])
        branches = []
        for place in places:
            name = place.get('name', '').lower()
            if 'unicredit' in name:
                branch = {
                    'name': place.get('name'),
                    'address': place.get('vicinity', 'No address provided'),
                    'location': place.get('geometry', {}).get('location', {})
                }
                branches.append(branch)
        return jsonify(branches)
    else:
        return jsonify({'error': 'Failed to fetch data from Google Maps API'}), response.status_code

@app.route('/request_money', methods=['POST'])
def request_money():
    data = request.get_json()
    requester_id = data.get('requester_id')
    amount = data.get('amount')
    reason = data.get('reason')
    from_iban = data.get('from_iban')
    
    if not (requester_id and amount and reason and from_iban):
        return jsonify({'error': 'All fields are required!'}), 400

    try:
        amount = float(amount)
        if amount <= 0:
            return jsonify({'error': 'Amount must be greater than zero!'}), 400
    except ValueError:
        return jsonify({'error': 'Invalid amount!'}), 400
    
    users = read_users()
    requester = next((user for user in users if user['uid'] == requester_id), None)
    
    if not requester:
        return jsonify({'error': 'Requester not found!'}), 404

    sender_index = find_by_iban(users, from_iban)
    if sender_index == -1:
        return jsonify({'error': 'Sender IBAN not found!'}), 404

    sender = users[sender_index]
    recipient_has_received_request = any(req['from_iban'] == from_iban for req in sender['requests'])

    request_data = {
        'request_id': str(uuid.uuid4()),
        'requester_id': requester_id,
        'requester_name': f"{requester['name']} {requester['surname']}",
        'amount': amount,
        'reason': reason,
        'from_iban': from_iban,
        'timestamp': str(datetime.datetime.utcnow()),
        'status': 'pending',
        'tag': 'new' if not recipient_has_received_request else 'friend'
    }
    
    sender['requests'].append(request_data)
    write_users(users)
    
    return jsonify({'message': 'Money request sent successfully!', 'request': request_data}), 201


@app.route('/accept_transaction', methods=['POST'])
def accept_transaction():
    data = request.get_json()
    request_id = data.get('request_id')
    action = data.get('action')
    
    if not (request_id and action):
        return jsonify({'error': 'Request ID and action are required!'}), 400
    
    users = read_users()
    transaction_request = None
    sender = None
    
    for user in users:
        for req in user['requests']:
            if req['request_id'] == request_id:
                transaction_request = req
                sender = user
                break
        if transaction_request:
            break
    
    if not transaction_request:
        return jsonify({'error': 'Request not found!'}), 404
    
    if action == 'accept':
        sender_index = find_by_iban(users, transaction_request['from_iban'])
        receiver_index = next((i for i, user in enumerate(users) if user['uid'] == transaction_request['requester_id']), -1)
        
        if sender_index == -1 or receiver_index == -1:
            return jsonify({'error': 'Invalid transaction details!'}), 400
        
        sender = users[sender_index]
        receiver = users[receiver_index]
        amount = transaction_request['amount']
        
        if sender['account_balance'] < amount:
            return jsonify({'error': 'Insufficient funds!'}), 400
        
        sender['account_balance'] -= amount
        receiver['account_balance'] += amount
        
        transaction = {
            'from': transaction_request['from_iban'],
            'to': receiver['IBAN'],
            'amount': amount,
            'timestamp': str(datetime.datetime.utcnow()),
            'to_name': receiver['name'] + " " + receiver['surname'],
            'to_reason': transaction_request['reason']
        }
        sender['history_transactions'].append(transaction)
        receiver['history_transactions'].append(transaction)
        transaction_request['status'] = 'accepted'
        
    elif action == 'reject':
        transaction_request['status'] = 'rejected'
    else:
        return jsonify({'error': 'Invalid action!'}), 400
    
    write_users(users)
    return jsonify({'message': 'Transaction processed successfully!', 'request': transaction_request}), 200

if __name__ == '__main__':
    app.run(debug=True,host="0.0.0.0")