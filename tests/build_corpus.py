#!/usr/bin/env python3
"""Vivarium oracle: independent python recompute of build math."""
import json, os

GLASS = 2.5
MIX = [('Tree fern fiber or sphagnum',2/5),('Peat or coco coir',1/5),
       ('Orchid bark',1/5),('Horticultural charcoal',1/5)]

def glass(L,W,H,t):
    if not (L>0 and W>0 and H>0 and t>0): return None
    l,w,h = L/100, W/100, H/100
    area = l*w + 2*l*h + 2*w*h
    return {'areaM2': round(area,2), 'weightKg': round(area*t*GLASS,1)}

def substrate(L,W,drain,soil,hp):
    if not (L>0 and W>0 and drain>=0 and soil>=0): return None
    if hp is None: hp = 0
    if hp < 0 or hp > 90: return None
    base = L*W/1000
    soil_raw = base*soil
    soil_net = soil_raw*(1-hp/100)
    return {'drainLiters': round(base*drain,1), 'soilLiters': round(soil_net,1),
            'soilBeforeHardscape': round(soil_raw,1),
            'mixLiters': [round(soil_net*f,1) for _,f in MIX]}

def air(L,W,H):
    if not (L>0 and W>0 and H>0): return None
    liters = L*W*H/1000
    return {'liters': round(liters,1), 'mistMinMl': round(liters*1000*0.02),
            'mistMaxMl': round(liters*1000*0.05)}

items = []
for args in [(60,45,60,6),(45,45,45,5),(90,45,45,8),(30,20,20,4),(0,45,60,6),(60,45,60,0)]:
    items.append({'kind':'glass','dims':list(args),'oracle':glass(*args)})
for args in [(60,45,5,10,0),(60,45,5,10,25),(45,45,3,8,10),(90,45,6,12,40),(60,45,-1,10,0),(60,45,5,10,95)]:
    items.append({'kind':'substrate','dims':list(args),'oracle':substrate(*args)})
for args in [(60,45,60),(45,45,45),(0,45,60),(120,60,60)]:
    items.append({'kind':'air','dims':list(args),'oracle':air(*args)})
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'expected.json')
json.dump({'items': items}, open(out,'w'))
print('cases:', len(items))
