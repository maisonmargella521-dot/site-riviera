const $ = (selector) => document.querySelector(selector);
const form = $('#bookingForm');
const checkin = $('#checkin');
const checkout = $('#checkout');
const room = $('#room');
const total = $('#total');
const error = $('#formError');
const today = new Date();
const isoToday = today.toISOString().split('T')[0];
checkin.min = isoToday;
checkout.min = isoToday;

function getBookings() {
  return JSON.parse(localStorage.getItem('riviera_bookings') || '[]');
}

function datesOverlap(start, end, booking) {
  return start < booking.checkout && end > booking.checkin;
}

function updateTotal() {
  if (!checkin.value || !checkout.value) { total.textContent = '—'; return; }
  const nights = Math.ceil((new Date(checkout.value) - new Date(checkin.value)) / 86400000);
  if (nights < 1) { total.textContent = '—'; return; }
  const price = Number(room.selectedOptions[0].dataset.price);
  total.textContent = `${(price * nights).toLocaleString('ru-RU')} ₽ · ${nights} ${nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}`;
}

checkin.addEventListener('change', () => {
  checkout.min = new Date(new Date(checkin.value).getTime() + 86400000).toISOString().split('T')[0];
  if (checkout.value && checkout.value <= checkin.value) checkout.value = '';
  updateTotal();
});
[checkout, room].forEach(el => el.addEventListener('change', updateTotal));

document.querySelectorAll('.choose').forEach(button => button.addEventListener('click', () => {
  room.value = button.closest('.room').dataset.room;
  updateTotal();
  $('#booking').scrollIntoView({behavior: 'smooth'});
}));

form.addEventListener('submit', (event) => {
  event.preventDefault(); error.textContent = '';
  const bookings = getBookings();
  const conflict = bookings.some(item => item.room === room.value && datesOverlap(checkin.value, checkout.value, item));
  if (conflict) { error.textContent = 'Эти даты уже заняты. Пожалуйста, выберите другой период или номер.'; return; }
  const booking = {id: Date.now(), createdAt: new Date().toISOString(), room: room.value, checkin: checkin.value, checkout: checkout.value, name: $('#name').value.trim(), phone: $('#phone').value.trim(), guests: $('#guests').value, total: total.textContent};
  bookings.push(booking);
  localStorage.setItem('riviera_bookings', JSON.stringify(bookings));
  form.reset(); checkin.min = isoToday; checkout.min = isoToday; total.textContent = '—';
  $('#toast').classList.add('show'); setTimeout(() => $('#toast').classList.remove('show'), 6000);
});

$('#toast button').addEventListener('click', () => $('#toast').classList.remove('show'));

const menu = $('.menu');
menu.addEventListener('click', () => {
  const nav = $('.header nav');
  nav.style.display = nav.style.display === 'flex' ? '' : 'flex';
  if (nav.style.display) Object.assign(nav.style, {position:'absolute', top:'70px', left:'0', right:'0', padding:'30px', background:'#183027', flexDirection:'column', gap:'22px'});
});
