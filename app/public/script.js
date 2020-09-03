
if (typeof window.orientation !== "undefined") {
  var mobile = true;
  searchBox = document.getElementById("search_box");
  searchBox.style.width = "auto";
  searchBox.style.marginTop = "4%";
}

function geo() {
  // User's geolocation
  if ('geolocation' in navigator) {

    navigator.geolocation.getCurrentPosition(async position => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;

      const coords = `${lat}, ${long}`

      // getting name from search box
      let inputVal = document.getElementById("query").value;

      // remvoing previous table on second query
      if (inputVal != undefined) {
        let table = document.getElementById("table");
        if (table != null) {
          table.remove();
        }
      }

      // alerting if search field is empty
      if (inputVal == "") {

        alertPara = document.getElementById("alert");
        if (alertPara == null) {
          alertPara = document.createElement("p");
          alertPara.setAttribute("class", "alert");
          alertPara.setAttribute("id", "alert");
          document.getElementById("alertDiv").appendChild(alertPara);
        }
        alertPara.innerHTML = "Please type something";

      } else {
        alertPara = document.getElementById("alert");
        if (alertPara != null) {
          alertPara.remove();
        }

        if (alertPara == null) {
          loader = document.createElement("div");
          loader.setAttribute("id", "loader");
          loader.setAttribute("class", "loader");
          document.getElementById("loaderDiv").appendChild(loader);

        } else {
          let loader = document.getElementById("loader");

          if (loader == null) {
            loader = document.createElement("div");
            loader.setAttribute("id", "loader");
            document.getElementById("loaderDiv").appendChild(loader);
          }
          loader.setAttribute("class", "loader");
        }


        // generaitng object
        const query = { name: inputVal, coords: { coordinates: coords } }

        // sending query to backend
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(query),
        };

        // receving results
        const response = await fetch("/query", options);
        let result = await response.json();

        // creating array from recevied object
        titles = Object.keys(result);
        addresses = Object.values(result);

        // alering if not found
        if (titles[0] == undefined) {
          alertPara = document.getElementById("alert");
          let loader = document.getElementById("loader");
          loader.removeAttribute("class", "loader");

          if (alertPara == null) {
            var alertPara = document.createElement("p");
            alertPara.setAttribute("id", "alert");
            alertPara.setAttribute("class", "alert");
            document.getElementById("alertDiv").appendChild(alertPara);
          }
          alertPara.innerHTML = "Not found!";
        } else {
          // Showing loader animation
          document.getElementById("loader").remove();

          // Retiving catagorey from address
          allCatagories = [
            "Animated",
            "Documentary",
            "E-Book",
            "Games",
            "Movies",
            "Softwares",
            "TV-Series",
            "Tutorials",
          ];

          String.prototype.isMatch = function (s) {
            return this.match(s) !== null;
          };

          var catagories = [];
          for (a in addresses) {
            for (c in allCatagories) {
              var match = addresses[a].isMatch(allCatagories[c]);

              if (match == true) {
                catagories.push(allCatagories[c]);
              }
            }
          }

          // outputting results

          // Creating Table
          let table = document.createElement("table");
          table.setAttribute("id", "table");
          table.setAttribute("class", "table");

          // Table header
          let thTr = document.createElement("tr");
          let thCat = document.createElement("th");
          let thName = document.createElement("th");
          thCat.setAttribute("class", "catHeader");
          thCat.innerHTML = "CATAGOREY";
          thName.innerHTML = "NAME";
          thTr.appendChild(thCat);
          thTr.appendChild(thName);
          table.appendChild(thTr);

          for (i in addresses) {
            // Title Adresses
            let anchor = document.createElement("a");
            anchor.setAttribute("href", addresses[i]);
            anchor.setAttribute("target", "_blank");
            anchor.setAttribute("class", "addresses");
            anchor.setAttribute("title", "Download");
            anchor.innerHTML = titles[i];

            // extracting previous address
            let prevAddress = addresses[i].substring(
              0,
              addresses[i].indexOf("]") + 1
            );

            // Catagories
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            td.setAttribute("class", "items");

            let tdCat = document.createElement("td");
            // tdCat.innerHTML = catagories[i]
            tdCat.setAttribute("class", "catagorey");

            if (prevAddress != "") {
              var prevA = document.createElement("a");
              prevA.setAttribute("href", prevAddress);
              prevA.setAttribute("target", "_blank");
              prevA.setAttribute("title", "Go to folder");
              prevA.innerHTML = catagories[i];
              tdCat.appendChild(prevA);
            } else {
              tdCat.innerHTML = catagories[i];
            }

            td.appendChild(anchor);
            tr.appendChild(tdCat);
            tr.appendChild(td);

            table.appendChild(tr);
          }

          let div = document.getElementById("tableDiv");
          div.appendChild(table);

          if (mobile == true) {
            let table = document.getElementById("table");
            table.style.width = "100%";
            table.style.marginTop = "4%";
          }

          // changing visited link color (resets after every refresh)
          let all_hrefs = document.querySelectorAll("a");
          all_hrefs.forEach(function (single_href) {
            single_href.addEventListener("click", function () {
              this.classList.add("visited");
            });
          });
        }
      }
    });

  } else {

    // Do stuff is geolocation is not available in browser

  }

}


async function nonGeo() {
  ////////// Will run if geolocation is blocked
  // getting name from search box
  let inputVal = document.getElementById("query").value;

  // remvoing previous table on second query
  if (inputVal != undefined) {
    let table = document.getElementById("table");
    if (table != null) {
      table.remove();
    }
  }

  // alerting if search field is empty
  if (inputVal == "") {

    alertPara = document.getElementById("alert");
    if (alertPara == null) {
      alertPara = document.createElement("p");
      alertPara.setAttribute("class", "alert");
      alertPara.setAttribute("id", "alert");
      document.getElementById("alertDiv").appendChild(alertPara);
    }
    alertPara.innerHTML = "Please type something";

  } else {
    alertPara = document.getElementById("alert");
    if (alertPara != null) {
      alertPara.remove();
    }

    if (alertPara == null) {
      loader = document.createElement("div");
      loader.setAttribute("id", "loader");
      loader.setAttribute("class", "loader");
      document.getElementById("loaderDiv").appendChild(loader);

    } else {
      let loader = document.getElementById("loader");

      if (loader == null) {
        loader = document.createElement("div");
        loader.setAttribute("id", "loader");
        document.getElementById("loaderDiv").appendChild(loader);
      }
      loader.setAttribute("class", "loader");
    }


    // generaitng object
    const query = { name: inputVal, coords: null };

    // sending query to backend
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    };

    // receving results
    const response = await fetch("/query", options);
    let result = await response.json();

    // creating array from recevied object
    titles = Object.keys(result);
    addresses = Object.values(result);

    // alering if not found
    if (titles[0] == undefined) {
      alertPara = document.getElementById("alert");
      let loader = document.getElementById("loader");
      loader.removeAttribute("class", "loader");

      if (alertPara == null) {
        var alertPara = document.createElement("p");
        alertPara.setAttribute("id", "alert");
        alertPara.setAttribute("class", "alert");
        document.getElementById("alertDiv").appendChild(alertPara);
      }
      alertPara.innerHTML = "Not found!";
    } else {
      // Showing loader animation
      document.getElementById("loader").remove();

      // Retiving catagorey from address
      allCatagories = [
        "Animated",
        "Documentary",
        "E-Book",
        "Games",
        "Movies",
        "Softwares",
        "TV-Series",
        "Tutorials",
      ];

      String.prototype.isMatch = function (s) {
        return this.match(s) !== null;
      };

      var catagories = [];
      for (a in addresses) {
        for (c in allCatagories) {
          var match = addresses[a].isMatch(allCatagories[c]);

          if (match == true) {
            catagories.push(allCatagories[c]);
          }
        }
      }

      // outputting results

      // Creating Table
      let table = document.createElement("table");
      table.setAttribute("id", "table");
      table.setAttribute("class", "table");

      // Table header
      let thTr = document.createElement("tr");
      let thCat = document.createElement("th");
      let thName = document.createElement("th");
      thCat.setAttribute("class", "catHeader");
      thCat.innerHTML = "CATAGOREY";
      thName.innerHTML = "NAME";
      thTr.appendChild(thCat);
      thTr.appendChild(thName);
      table.appendChild(thTr);

      for (i in addresses) {
        // Title Adresses
        let anchor = document.createElement("a");
        anchor.setAttribute("href", addresses[i]);
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("class", "addresses");
        anchor.setAttribute("title", "Download");
        anchor.innerHTML = titles[i];

        // extracting previous address
        let prevAddress = addresses[i].substring(
          0,
          addresses[i].indexOf("]") + 1
        );

        // Catagories
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.setAttribute("class", "items");

        let tdCat = document.createElement("td");
        // tdCat.innerHTML = catagories[i]
        tdCat.setAttribute("class", "catagorey");

        if (prevAddress != "") {
          var prevA = document.createElement("a");
          prevA.setAttribute("href", prevAddress);
          prevA.setAttribute("target", "_blank");
          prevA.setAttribute("title", "Go to folder");
          prevA.innerHTML = catagories[i];
          tdCat.appendChild(prevA);
        } else {
          tdCat.innerHTML = catagories[i];
        }

        td.appendChild(anchor);
        tr.appendChild(tdCat);
        tr.appendChild(td);

        table.appendChild(tr);
      }

      let div = document.getElementById("tableDiv");
      div.appendChild(table);

      if (mobile == true) {
        let table = document.getElementById("table");
        table.style.width = "100%";
        table.style.marginTop = "4%";
      }

      // changing visited link color (resets after every refresh)
      let all_hrefs = document.querySelectorAll("a");
      all_hrefs.forEach(function (single_href) {
        single_href.addEventListener("click", function () {
          this.classList.add("visited");
        });
      });
    }
  }
}


async function getInputValue() {

  function handlePermission() {
    navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
      if (result.state == 'granted') {
        geo()
      } else if (result.state == 'prompt') {
        nonGeo()
      } else if (result.state == 'denied') {
        nonGeo()
      }

    });
  }

  handlePermission()

}