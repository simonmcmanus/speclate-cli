var dynamicRoutes = require('../lib/generators/dynamic-routes')

describe('given a spec with dynamic routes ', function () {

  var spec = {
    '/links/:date/index.html': {
      page: 'link',
      data: [
        {
          'date': '2007-12-12',
          title: 'item 1'
        },
        {
          'date': '2007-10-10',
          title: 'item 2'
        },
        {
          'date': '2007-10-10',
          title: 'item 3'
        }
      ],
      spec: {
        title: 'page title',
        '.links_holder': {
          component: 'link'
        }
      }
    }
  }
  describe ('calling dynmaic-routes', function () {

    var generatedRoutes = dynamicRoutes(spec);

//    console.log('-=--', generatedRoutes)

    it('should not change the title value', () => {
      expect(generatedRoutes['/links/2007-10-10/index.html'].spec.title).toEqual('page title')
    });

    it('Should generate the dynamic route for 2007-10-10', () => {

      console.log('gpt back', generatedRoutes['/links/2007-10-10/index.html'].spec['.links_holder'].data.length)
      expect(generatedRoutes['/links/2007-10-10/index.html'].spec['.links_holder'].data.length).toEqual(2)
      expect(generatedRoutes['/links/2007-10-10/index.html'].spec['.links_holder'].data[0]['date']).toEqual('2007-10-10')
    })




    it('should not change the title value', () => {
      expect(generatedRoutes['/links/2007-12-12/index.html'].spec.title).toEqual('page title')
    });

    it('Should generate the dynamic route for 2007-12-12', () => {
      expect(generatedRoutes['/links/2007-12-12/index.html'].spec['.links_holder'].data.length).toEqual(1)
      expect(generatedRoutes['/links/2007-12-12/index.html'].spec['.links_holder'].data[0]['date']).toEqual('2007-12-12')
    })

    it('should remove the orignal dynamic route', () => {
      expect(generatedRoutes['/:date/index.html']).toEqual(undefined)
    })
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
