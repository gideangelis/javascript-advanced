import axios from "axios";
import Chart from 'chart.js/auto';

// GET requests for teleport API 
export async function fetchCityData(cityName) {
  const url = `https://api.teleport.org/api/cities/?search=${cityName}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchCityApiData(cityData) {
  const cityId =
    cityData._embedded["city:search-results"][0]._links["city:item"].href;
  const cityApi = await axios.get(cityId);
  return cityApi.data;
}

export async function fetchUrbanAreaScores(cityApiData) {
  const urbanAreaId = cityApiData._links["city:urban_area"].href;
  const urbanAreaApi = await axios.get(`${urbanAreaId}scores/`);
  return urbanAreaApi.data;
}


// Create chart 
export function createScoresChart(data) {

    const categories = data.categories.map(category => {
        return {
            label: category.name,
            data: [category.score_out_of_10],
            backgroundColor: 'rgb(100, 173, 252, 0.3)',
            borderColor: 'rgb(100, 173, 252)',
            borderWidth: 1
        };
    });

    const myChart = document.getElementById('myChart');

    new Chart(myChart, {
        type: 'bar',
        data: {
            labels: [''],
            datasets: categories
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Mouse over to view details',
                    font: {
                        size: 18,
                        color: '#6b6c6d',
                        family: 'Poppins, sans-serif',
                        weight: 'normal'
                    }
                },
                legend: {
                    display: false,
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 10
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

}


