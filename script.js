let text = document.querySelector('.Wrapper');
let links = document.querySelectorAll('a[href^="#"]');
let usersList = document.querySelector('.Users');
let skipUsers = 0;
let limitUsers = 20;
let count = 1;
//присвоение класса элементам fotter при прокрутке
function activeLink() {
  links.forEach((el) => {
    el.classList.remove('active');
  });
  let newLink = document.querySelector(`[href="#page${count}"]`);
  if (newLink) {
    newLink.classList.add('active');
  }
}
// присвоение класса footer при клике
links.forEach((el) => {
  el.addEventListener('click', (e) => {
    links.forEach((el) => {
      el.classList.remove('active');
    });
    e.preventDefault();
    const id = el.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    el.classList.add('active');
  });
});
// получаем пользователей
async function getUsers(skip, limit) {
  let response = await fetch(`https://dummyjson.com/users?skip=${skip}&limit=${limit}`);
  if (response.ok) {
    data = await response.json();
    return data.users;
  }
}
//обрабатываем их и помещаем в HTML
async function showUsers() {
  let users = await getUsers(skipUsers, limitUsers);
  users.forEach((item) => {
    let userItem = document.createElement('li');
    if (item.id === skipUsers + 1) {
      userItem.setAttribute('id', `page${count}`);
    }
    userItem.classList.add('User');
    userItem.innerHTML = `<span>${item.id}</span> ${item.lastName} ${item.firstName} - ${item.age} `;
    usersList.appendChild(userItem);
  });
  skipUsers = skipUsers + limitUsers;
}

showUsers();
//Observer
setTimeout(() => {
  const callback = function (entires, observer) {
    entires.forEach((entry) => {
      const { target, intersectionRatio, isIntersecting } = entry;
      if (isIntersecting && intersectionRatio == 1) {
        console.log(count);
        if (count < 5) {
          count++;
        } else {
          observer.unobserve(entry.target);
          count == 5;
        }
        if (count == 5) {
          target.classList.add('hidden');
        }
        showUsers();
        activeLink();
      }
    });
  };

  const options = {
    threshold: 1,
    rootMargin: '0px 0px 50px 0px',
  };

  const observer = new IntersectionObserver(callback, options);
  let element = document.querySelector('.BtnLoad');
  observer.observe(element);
}, 1000);
