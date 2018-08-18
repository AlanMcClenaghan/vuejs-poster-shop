const PRICE = 9.99;
const LOAD_NUM = 10;

new Vue({
  el: '#app',
  data: {
    total: 0,
    items: [],
    cart: [],
    results: [],
    search: 'anime',
    lastSearch: '',
    loading: false,
    price: PRICE
  },
  computed: {
    noMoreItems: function () {
      return this.items.length === this.results.length && this.results.length > 0
    }
  },
  methods: {
    appendItems: function () {
      if (this.items.length < this.results.length) {
        let append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
        this.items = this.items.concat(append);
      }
    },
    onSubmit: function () {
      if (this.search.length) {
        this.items = [];
        this.loading = true;
        this.$http
          .get('/search/'.concat(this.search))
          .then(function (response) {
            this.lastSearch = this.search;
            this.results = response.data;
            this.appendItems();
            this.loading = false;
            this.search = '';
          });
      }
    },
    addItem: function (index) {
      this.total += PRICE;
      let item = this.items[index];
      let found = false;
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === item.id) {
          found = true;
          this.cart[i].qty++;
          break;
        }
      }
      if (!found) {
        this.cart.push({
          id: item.id,
          title: item.title,
          qty: 1,
          price: PRICE
        });
      }
    },
    increment: function (item) {
      item.qty++;
      this.total += PRICE;
    },
    decrement: function (item) {
      item.qty--;
      this.total -= PRICE;
      if (item.qty <= 0) {
        for (let i = 0; i < this.cart.length; i++) {
          if (this.cart[i].id === item.id) {
            this.cart.splice(i, 1);
            break;
          }
        }
      }
    }
  },
  filters: {
    currency: function (price) {
      return '$'.concat(price.toFixed(2));
    }
  },
  mounted: function () {
    this.onSubmit();

    const element = document.getElementById('product-list-bottom');
    const watcher = scrollMonitor.create(element);
    const vueInstance = this;
    watcher.enterViewport(function () {
      vueInstance.appendItems();
    });
  }
});