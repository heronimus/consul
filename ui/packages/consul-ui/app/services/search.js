import Service from '@ember/service';
import setHelpers from 'mnemonist/set';

import intention from 'consul-ui/search/predicates/intention';
import upstreamInstance from 'consul-ui/search/predicates/upstream-instance';
import serviceInstance from 'consul-ui/search/predicates/service-instance';
import acl from 'consul-ui/search/predicates/acl';
import service from 'consul-ui/search/predicates/service';
import node from 'consul-ui/search/predicates/node';
import kv from 'consul-ui/search/predicates/kv';

import token from 'consul-ui/search/filters/token';
import policy from 'consul-ui/search/filters/policy';
import role from 'consul-ui/search/filters/role';
// service instance
import nodeService from 'consul-ui/search/filters/node/service';
import serviceNode from 'consul-ui/search/filters/service/node';
import nspace from 'consul-ui/search/filters/nspace';

import filterableFactory from 'consul-ui/utils/search/filterable';
const filterable = filterableFactory();
const searchables = {
  token: token(filterable),
  policy: policy(filterable),
  role: role(filterable),
  serviceInstance: serviceNode(filterable),
  nodeservice: nodeService(filterable),
  nspace: nspace(filterable),
};
export const search = spec => {
  let possible = Object.keys(spec);
  return (term, options = {}) => {
    const actual = [
      ...setHelpers.intersection(new Set(possible), new Set(options.properties || possible)),
    ];
    return item => {
      return (
        typeof actual.find(key => {
          return spec[key](item, term);
        }) !== 'undefined'
      );
    };
  };
};
const predicates = {
  intention: search(intention),
  service: search(service),
  node: search(node),
  kv: search(kv),
  ['service-instance']: search(serviceInstance),
  acl: search(acl),
  ['upstream-instance']: upstreamInstance(),
};
export default class SearchService extends Service {
  searchable(name) {
    return searchables[name];
  }
  predicate(name) {
    return predicates[name];
  }
}
