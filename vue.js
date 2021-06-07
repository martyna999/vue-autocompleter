var app = new Vue({
    el: '#app',
    data: {
      googleSearch: "",
      results: [],
      cities: window.cities,
      searchedInput:'',
      filteredCities:"",
      filteredCities2: true,
      el_focus: false,
      change: false,
      mark: -1,
    },

    watch: {
        mark() {
            this.filteredCities2 = false;
            this.googleSearch = this.filteredCities[this.mark].name;
        },

        googleSearch() {
            this.create(this.filteredCities2);
            this.filteredCities2 = true;
            console.log(this.filteredCities); 

            if (this.mark == -1)
            {
                this.searchedInput = this.googleSearch;      
            }
        }
    },

    methods: {
        down(){
            if (this.mark < this.filteredCities.length-1)
            {
                this.mark += 1; 
            }
            else if (this.mark == this.filteredCities.length-1)
            {
                this.mark = 0; 
            }
        },
        
        up() {
            if (this.mark > 0)
            {
                this.mark -= 1; 
            }
                else if (this.mark == 0)
                {
                    this.mark = this.filteredCities.length-1;
                }
        },

        enter() {
            this.filteredCities = true;
            this.change = true;
            this.mark = -1;
            this.el_focus = false;
        },

        chosen(i) {
            this.googleSearch = this.filteredCities[i].name;
            this.enter();
        },
             
        active() {
            if (this.googleSearch.length == 0)
            {
                this.change = false;
            }
            
            return this.change;
        },
            
        create(value) {
            if (value)
            {
                let result = this.cities.filter(city => city.name.includes(this.googleSearch));
                
                if (result.length > 10)
                {
                    this.filteredCities = result.slice(0, 10);
                }

                else 
                {
                    this.filteredCities = result;
                }

                this.mark = -1;
            }   
        },
             
        bold_letter(city) {
            let re = new RegExp(this.searchedInput, "gi");
            let bolden = "<b>" + city.name.replace(re, match =>
                {
                    return "<span class='without_bold'>" +  match + "</span>";
                }) + "</b>";

            console.log(bolden);
            return bolden;
        },

        findResultsDebounced : Cowboy.debounce(100, function findResultsDebounced() {
            console.log('Fetch: ', this.googleSearch)
            fetch(`http://localhost/search?name=${this.googleSearch}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Data: ', data);
                    this.results = data;
                });
        })      
    }
  });