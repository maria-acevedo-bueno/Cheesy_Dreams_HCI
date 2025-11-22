from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__, template_folder='../front')

# In-memory users dictionary
users = {
    'staff@example.com': {'password': 'staffpass', 'role': 'Staff'},
    'manager@example.com': {'password': 'managerpass', 'role': 'Manager'},
    'customer@example.com': {'password': 'customerpass', 'role': 'Customer'}
}

# ---------------- AUTH ---------------- #

@app.route('/', methods=['GET', 'POST'], endpoint='login')
def login():
    error_message = ''
    if request.method == 'POST':
        # normalize email
        email = request.form['email'].strip().lower()
        password = request.form['password']
        user_type = request.form['user-type']

        user = users.get(email)
        if user and user['password'] == password and user['role'].lower() == user_type.lower():
            # Según el rol redirigimos a una pag u otra.
            if user_type.lower() == 'manager':
                return redirect(url_for('manager_dashboard'))
            elif user_type.lower() == 'staff':
                return redirect(url_for('staff_checkin'))
            elif user_type.lower() == 'customer':
                return redirect(url_for('customer_home'))
        else:
            error_message = 'Usuario o contraseña incorrecta'

    return render_template('login.html', error_message=error_message)


@app.route('/register', methods=['GET', 'POST'], endpoint='register')
def register():
    error_message = ''
    if request.method == 'POST':
        email = request.form['email'].strip().lower()
        password = request.form['password']
        user_type = request.form['user-type']  # 'Customer' or 'Staff'

        # Only allow Customer and Staff registration
        allowed_roles = ['customer', 'staff']

        if user_type.lower() not in allowed_roles:
            error_message = 'Solo puedes registrarte como Staff o Customer.'
        elif email in users:
            error_message = 'Ya existe un usuario con ese email.'
        else:
            # Normalize role names like in users dict
            role = 'Customer' if user_type.lower() == 'customer' else 'Staff'
            users[email] = {'password': password, 'role': role}
            # After successful registration, send to login
            return redirect(url_for('login'))

    return render_template('register.html', error_message=error_message)

# ------------- MANAGER ROUTES ---------- #

@app.route('/manager/dashboard')
def manager_dashboard():
    return render_template('manager/revised_dashboard_overview.html')

@app.route('/manager/manage_reservations')
def manage_reservation():
    return render_template('manager/reservation_management.html')

@app.route('/manager/pending_reservations')
def pending_reservation():
    return render_template('manager/pending_reservation_screen.html')

@app.route('/manager/edit_reservations')
def edit_reservation():
    return render_template('manager/edit_reservation_details.html')

@app.route('/manager/cancel_reservations')
def cancel_reservation():
    return render_template('manager/cancel_reservation_confirmation.html')

@app.route('/manager/inventory')
def inventory():
    return render_template('manager/inventory_management_module.html')

@app.route('/manager/sales')
def sales():
    return render_template('manager/sales_reports_page.html')

# --------------- STAFF ROUTES ---------- #

@app.route('/staff/staff_checkin')
def staff_checkin():
    return render_template('staff/check.html')

@app.route('/staff/staff_checkout')
def staff_checkout():
    return render_template('staff/checkout.html')

@app.route('/staff/reservations')
def staff_reservations():
    return render_template('staff/reservations_staff.html')

@app.route('/staff/live')
def live():
    return render_template('staff/live_orders.html')

@app.route('/staff/task')
def task():
    return render_template('staff/today_task.html')

@app.route('/staff/pizza1')
def pizza1():
    return render_template('staff/pizza1.html')

@app.route('/staff/pizza2')
def pizza2():
    return render_template('staff/pizza2.html')

@app.route('/staff/pizza3')
def pizza3():
    return render_template('staff/pizza3.html')

@app.route('/staff/pizza4')
def pizza4():
    return render_template('staff/pizza4.html')

@app.route('/staff/pizza5')
def pizza5():
    return render_template('staff/pizza5.html')

@app.route('/staff/live_orders.html') 
def live_orders_html():
    return render_template('staff/live_orders.html')

@app.route('/staff/today_task.html') 
def today_task_html(): 
    return render_template('staff/today_task.html')


# -------------- CUSTOMER ROUTES -------- #

@app.route('/customer/home')
def customer_home():
    return render_template('customer/cheesy_dreams_homepage.html')

@app.route('/customer/menu')
def customer_menu():
    return render_template('customer/filtered_menu_browsing.html')

@app.route('/customer/make_reservation')
def make_reservation():
    return render_template('customer/reservation_details_selection.html')

@app.route('/customer/confirm_reservation')
def confirm_reservation():
    return render_template('customer/reservation_confirmation.html')

# --------------- LOGOUT ---------------- #

@app.route('/logout')
def logout():
    # Obtiene la URL de la página anterior. Si no existe, vuelve a la página de login.
    # previous_url = request.referrer or url_for('login')
    return render_template('logout.html')

# --------------- MAIN ------------------ #

if __name__ == '__main__':
    # Esto te permite verificar que la ruta /register existe:
    print(app.url_map)
    app.run(debug=True)
