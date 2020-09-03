from bs4 import BeautifulSoup
import requests
import re
import json

# prompt = input('>> ')
# current_page = 'http://fs.ebox.live/' + prompt.split(',')[0]
# query = prompt.split(',')[1].lower()

catagorey = input('Catagorey > ')
name = input('Name > ')


current_page = 'http://fs.ebox.live/' + catagorey

# scraping data, outputs a dictionray


def all_items(page):
    source = requests.get(page).text
    soup = BeautifulSoup(source, 'lxml')

    table = soup.find('tbody')
    anchors = table.find_all('a')

    links = []
    for anchor in anchors:
        links.append(anchor.get('href'))

    prev_addr = page
    full_links = []
    for link in links:
        l = f'{prev_addr}/{link}'
        full_links.append(l)

    titles = []
    for anchor in anchors:
        titles.append(anchor.text)

    return dict(zip(titles, full_links))

# searches through titiles and returns links


def search(items, search_term):
    titles = list(items.keys())
    # matches = []
    for title in titles:
        x = re.search(search_term, title.lower())
        if x:
            # matches.append(items[title])
            return items[title]
    return False


items = all_items(current_page)
inv_items = {v: k for k, v in items.items()}
links = items.values()

results = []

# 2nd layer of searching


def search2(links):
    for link in links:
        current_page = link
        items = all_items(current_page)
        inv_items = {v: k for k, v in items.items()}
        result = search(items, name)

        links = items.values()
        for link in links:
            current_page = link
            items = all_items(current_page)
            inv_items = {v: k for k, v in items.items()}
            result = search(items, name)
            if result != False:
                output = {inv_items[result]: result}
                results.append(output)


# sepcial cases
if catagorey == 'Movies':
    search2(links)

elif catagorey == 'Documentary':
    search2(links)

else:
    for link in links:
        current_page = link
        items = all_items(current_page)
        inv_items = {v: k for k, v in items.items()}
        result = search(items, name)
        if result != False:
            output = {inv_items[result]: result}
            results.append(output)


# outputting JSON
outputs = {}
for d in results:
    outputs.update(d)


print(outputs)
