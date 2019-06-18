from flask import Flask, render_template, request, jsonify
import configparser
import requests
from math import isnan
import random

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('roulette.html')


@app.route('/spin/', methods=['POST'])
def spin():
    steam_id = request.form.get('username')

    parser = configparser.ConfigParser()
    parser.read('config.ini')

    # Determine if we need to convert a vanity url e.g. 'Robotron1234' to a SteamID64
    # Currently only converts from a vanity url to a SteamID64 or detects a SteamID64
    if len(steam_id) == 17 and not isnan(steam_id):
        print('%s is a SteamID64' % steam_id)
    else:
        print('%s is a VanityURL' % steam_id)
        response = requests.get('https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/',
                                params={'key': parser['api_keys']['steam'], 'vanityurl': steam_id},
                                )
        json_response = response.json()
        steam_id = json_response['response']['steamid']
        print("Resolved vanity url as %s" % steam_id)

    # Begin to retrieve a list of games owned by the player
    response = requests.get('https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/',
                            params={'key': parser['api_keys']['steam'], 'steamid': steam_id, 'include_appinfo': 1,
                                    'include_played_free_games': 1},
                            )

    # Generate a random number between 0 and the count of owned games and select a game from the list of owned games
    owned_games = response.json()
    game_count = owned_games['response']['game_count']
    random_number = random.randint(0, game_count-1)
    selected_game = owned_games['response']['games'][random_number]

    print("Selected %s" % selected_game)

    selected_game_json = {'name': selected_game['name'], 'img_logo_url': selected_game['img_logo_url'],
                          'app_id': selected_game['appid']}

    return jsonify(selected_game_json)


if __name__ == '__main__':
    app.run()
