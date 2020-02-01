var dynamicRoutes = require('../lib/generators/dynamic-routes')

describe('given a spec with top level list attribute and a replaceable token in the route ', function () {
  var spec = {
    '/links/:date/index.html': {
      page: 'link',
      lists: ['links'],
      spec: {
        'ul': {
          component: 'link',
          lists: ['links'],
          filters: ['byDate']
        }
      }
    }
  }
  describe('calling dynmaic-routes with a lists of links', function () {
    var lists = {
      lists: {
        links: [ { date: '31-12-19' } ]
      }
    }

    var generatedRoutes = dynamicRoutes(spec, lists)

    it('should generate the link for the date in the links list', () => {
      expect(typeof generatedRoutes['/links/31-12-19/index.html']).toEqual('object')
    })

    it('should set the page attribute on the generated route', () => {
      expect(generatedRoutes['/links/31-12-19/index.html'].page).toEqual('link')
    })

    // it('should not change the title value', () => {
    //   expect(generatedRoutes['/links/2007-10-10/index.html'].spec.title).toEqual('page title')
    // })

    // it('Should generate the dynamic route for 2007-10-10', () => {

    //   console.log('gpt back', generatedRoutes['/links/2007-10-10/index.html'].spec['.links_holder'].data.length)
    //   expect(generatedRoutes['/links/2007-10-10/index.html'].spec['.links_holder'].data.length).toEqual(2)
    //   expect(generatedRoutes['/links/2007-10-10/index.html'].spec['.links_holder'].data[0]['date']).toEqual('2007-10-10')
    // })

    // it('should not change the title value', () => {
    //   expect(generatedRoutes['/links/2007-12-12/index.html'].spec.title).toEqual('page title')
    // });

    // it('Should generate the dynamic route for 2007-12-12', () => {
    //   expect(generatedRoutes['/links/2007-12-12/index.html'].spec['.links_holder'].data.length).toEqual(1)
    //   expect(generatedRoutes['/links/2007-12-12/index.html'].spec['.links_holder'].data[0]['date']).toEqual('2007-12-12')
    // })

    // it('should remove the orignal dynamic route', () => {
    //   expect(generatedRoutes['/:date/index.html']).toEqual(undefined)
    // })
  })
})

// describe('given a spec with dynamic routes with urls specified in the data', function () {

//   var spec = {
//     '/:date/index.html': {
//       page: 'link',
//       data: [
//         {
//           id: 1,
//           url: '/hi.html',
//           title: 'hi there',
//           '.title': 'hi there',
//           '.summary': 'this is the full summary'
//         },
//         {
//           id: 2,
//           url: '/bye.html',
//           title: 'bye there',
//           '.title': 'bye there',
//           '.summary': 'this is the full summary of bye'
//         }
//       ]
//     }
//   }
//   describe('calling dynmaic-routes', function () {

//     var generatedRoutes = dynamicRoutes(spec);
//     console.log('=>',generatedRoutes)
//     //console.log(generatedRoutes)

//     it('should generate a route based on the url property', () => {
//       expect(generatedRoutes['/bye.html'].spec.title).toEqual('bye there')
//       expect(generatedRoutes['/hi.html'].spec.title).toEqual('hi there')
//     });

//     it('should remove the orignal dynamic route', () => {
//       expect(generatedRoutes['/:date/index.html']).toEqual(undefined)
//     })
//   })
// })
