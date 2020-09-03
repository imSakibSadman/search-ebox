# From standrad library
import requests
import json
import re
import os
import sys
# From non-standard libraby
from bs4 import BeautifulSoup
from tqdm import tqdm
import eventlet
import arrow
eventlet.monkey_patch()


pages = {'http://fs.ebox.live/Animated%20and%20Anime-Series/': 'animated', 'http://fs.ebox.live/Documentary/': 'documentary',
         'http://fs.ebox.live/E-Book-Collection/': 'ebook', 'http://fs.ebox.live/Games/': 'games',
         'http://fs.ebox.live/Movies/': 'movies', 'http://fs.ebox.live/Softwares/': 'softwares',
         'http://fs.ebox.live/TV-Series/': 'tv-series', 'http://fs.ebox.live/Tutorials/': 'tutorials'}

exceptions = ['.mp4', '.mkv', '.m4a', '.m4v', '.f4v', '.f4a', '.m4b', '.m4r', '.f4b', '.mov',
              '.3gp', '.3gp2', '.3g2', '.3gpp', '.3gpp2', '.wmv', '.wma', '.asf',
              '.webm', '.flv', '.avi', '.quicktime', '.hdv', '.mxf', '.wav', '.mxf', '.vob', '.wmv', '.mpg', '.mp2',
              '.mpeg', '.mpe', '.mpv', '.mpg', '.mpeg', '.m2v']

logfile = open('/home/sakib/projects/ebox/ebox-data/log.txt', 'a')

# Writing date and time to log file
dt_now = arrow.now('Asia/Dhaka')
date = dt_now.strftime('%B %d, %Y')
time = dt_now.format('HH:mm:ss')
date_time = date + ' ' + time
logfile.write(date_time + '\n')


def anchors(page):
    with eventlet.Timeout(10):
        try:
            source = requests.get(page).text
            soup = BeautifulSoup(source, 'lxml')

            table = soup.find('tbody')
            try:
                anchors = table.find_all('a')
            except AttributeError:
                return False
            return anchors
        except eventlet.timeout.Timeout:
            return False

# gets all hrefs from the anchor tags


def all_links(page):
    a = anchors(page)

    if a == False:
        return False
    else:
        links = []
        for anchor in a:
            links.append(page + anchor.get('href'))
    return links


# gets all titles(tags) from the anchor tags
def all_titles(page):
    a = anchors(page)

    if a == False:
        return False
    titles = []
    for anchor in a:
        titles.append(anchor.text)

    return titles


# prepares data
def prepare_data(slashed_titles, addresses):
    # removing slash from title
    un_slashed = []
    for title in slashed_titles:
        t = re.sub('/', '', title)
        un_slashed.append(t)

    # creating dictionay with titles and addresses
    data = dict(zip(un_slashed, addresses))
    return data


def search_exception(string):
    s = string.lower()
    for exception in exceptions:
        if exception in s:
            return string


def search(mylist):
    matches = []
    for i in mylist:
        alt_i = i.lower()
        for exception in exceptions:
            if exception in alt_i:
                matches.append(i)

    try:
        return matches[0]
    except IndexError:
        return 'Null'


for page in pages.keys():
    main_page = page
    cat = pages[main_page]

    print(f'Scraping {cat}...')

    if cat == 'movies':
        # gets links of the second pages (year page)
        sec_links = []
        for link in tqdm(all_links(main_page)[1:]):
            l = all_links(link)
            l.pop(0)
            for i in l:
                sec_links.append(i)

        # final folder links and titles
        addresses = []
        titles = []
        for link in tqdm(sec_links):
            l = all_links(link)
            l.pop(0)  # removes exccess data
            t = all_titles(link)  # getting titles
            t.pop(0)  # removes exccess data
            for i in l:
                addresses.append(i)
            for i in t:
                titles.append(i)

        # Getting final links
        matches = []
        for link in tqdm(addresses):
            if link == 'http://fs.ebox.live/Movies/Bollywood/1996/1993/':
                matches.append(link)

            elif search_exception(link) == None:
                l = all_links(link)
                if l == False:
                    matches.append(link)

                elif l != False:
                    l.pop(0)
                    video = search(l)
                    if video == '':
                        for i in l:
                            matches.append(i)
                    elif video != None:
                        matches.append(video)

            else:
                matches.append(link)

        data = prepare_data(titles, matches)
        # Writing length in text file
        logfile.write(f'{cat}: {len(titles)}, {len(matches)} \n')

    elif cat == 'documentary':
        # first link and titles
        addrs = []
        titls = []
        for link in tqdm(all_links(main_page)[1:]):
            l = all_links(link)
            l.pop(0)  # removes exccess data
            addrs.append(l)
            t = all_titles(link)  # getting titles
            t.pop(0)  # removes exccess data
            titls.append(t)

        # second links and titles
        addresses = list(addrs[1:])
        titles = list(titls[1:])
        for link in tqdm(addrs[0]):
            l = all_links(link)
            l.pop(0)
            addresses.append(l)
            t = all_titles(link)
            t.pop(0)
            titles.append(t)

        addresses = list(i for j in addresses for i in j)
        titles = list(i for j in titles for i in j)

        data = prepare_data(titles, addresses)
        # Writing length in text file
        logfile.write(f'{cat}: {len(titles)}, {len(addresses)} \n')

    elif cat == 'tv-series' or cat == 'games' or cat == 'softwares':
        addresses = []
        titles = []
        for link in tqdm(all_links(main_page)[1:]):
            l = all_links(link)
            l.pop(0)  # removes exccess data
            t = all_titles(link)  # getting titles
            t.pop(0)  # removes exccess data
            # print(t)
            for i in l:
                addresses.append(i)

            titles.append(t)

        titles = list(i for j in titles for i in j)

        data = prepare_data(titles, addresses)
        # Writing length in text file
        logfile.write(f'{cat}: {len(titles)}, {len(addresses)} \n')

    elif cat == 'animated' or cat == 'tutorials':
        addresses = all_links(main_page)
        titles = all_titles(main_page)
        titles.pop(0)
        addresses.pop(0)

        data = prepare_data(titles, addresses)
        # Writing length in text file
        logfile.write(f'{cat}: {len(titles)}, {len(addresses)} \n')

    elif cat == 'ebook':
        exeption = 'http://fs.ebox.live/E-Book-Collection/English/E-Book%20Collection/'
        # gets links of the second pages (year page)
        sec_links = []
        for link in tqdm(all_links(main_page)[1:]):
            l = all_links(link)
            l.pop(0)
            for i in l:
                sec_links.append(i)

        # for ebook collection alphabetical english page
        sec_links.remove(exeption)  # removing expection
        link = all_links(exeption)
        link.pop(0)
        for i in link:
            sec_links.append(i)

        # final links and titles
        addresses = []
        titles = []
        for link in tqdm(sec_links):
            l = all_links(link)
            l.pop(0)
            for i in l:
                addresses.append(i)
            t = all_titles(link)
            t.pop(0)
            for i in t:
                titles.append(i)

        data = prepare_data(titles, addresses)
        # Writing length in text file
        logfile.write(f'{cat}: {len(titles)}, {len(addresses)} \n')

    # writing to a file the data dictionary in JSON format
    path = os.path.join(os.path.abspath(
        os.path.dirname(sys.argv[0])), f'datas/{cat}.json')
    with open(path, 'w') as outfile:
        json.dump(data, outfile)


logfile.write(' ' + '\n')

# Combining all datas
root = os.path.join(os.path.abspath(os.path.dirname(sys.argv[0])), 'datas')
files = []
# r = oot, d = directories, f = files
for r, d, f in os.walk(root):
    for file in f:
        if '.json' in file:
            files.append(os.path.join(r, file))

all_data = {}
for file in files:
    path = file
    with open(path, 'r') as infile:
        data = json.load(infile)
        all_data.update(data)

# Writing combined data to main web app's function folder
path = os.path.join(os.path.abspath(os.path.dirname(
    sys.argv[0])), '../app/functions/datas/all-data.json')
with open(path, 'w') as outfile:
    json.dump(all_data, outfile)

print('Scraped and wrote all data!')
